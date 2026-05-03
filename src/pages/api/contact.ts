import type { APIRoute } from 'astro';
import {
  getClientFingerprint,
  rateLimiter,
  checkOrigin,
  DEFAULT_ALLOWED_HOSTS,
  looksLikeSpam,
  isValidEmail,
} from '~/lib/security';

export const prerender = false;

const DIRECTUS = import.meta.env.DIRECTUS_INTERNAL_URL ?? 'http://directus:8055';

const ALLOWED_SERVICES = new Set([
  'creation-vitrine',
  'creation-gestion',
  'creation-e-commerce',
  'creation-logiciel',
  'maintenance-essentiel',
  'maintenance-pro',
  'maintenance-premium',
  'maintenance-legendaire',
  'hesite',
]);

// Anti-bot : seuils de remplissage humain plausible
const MIN_FILL_TIME_MS = 2500;       // < 2.5s = bot
const MAX_FILL_TIME_MS = 30 * 60_000; // > 30 min = formulaire périmé

// Rate limit : 3 envois par 10 minutes par fingerprint
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 10 * 60_000;

interface Payload {
  last_name?: string;
  first_name?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_postal?: string;
  subject?: string;
  service_interest?: string;
  message?: string;
  // Champs anti-bot
  website?: string;       // honeypot — un humain ne le voit pas, un bot le remplit
  _ts?: string | number;  // timestamp injecté par JS au chargement de la page
}

const trim = (s: unknown): string => (typeof s === 'string' ? s.trim() : '');

// "Succès silencieux" : on retourne 200 même quand on jette une soumission bot,
// pour ne pas leur donner de signal et ne pas leur permettre d'itérer.
const fakeSuccess = () => json({ ok: true }, 200);

export const POST: APIRoute = async ({ request }) => {
  // 1. Vérification d'origine (anti-CSRF en complément du check natif Astro)
  if (!checkOrigin(request, DEFAULT_ALLOWED_HOSTS)) {
    return json({ ok: false, error: 'Origine non autorisée.' }, 403);
  }

  // 2. Limite de taille du body (~12KB max, plus est suspect)
  const lenHeader = request.headers.get('content-length');
  if (lenHeader && Number(lenHeader) > 12_000) {
    return json({ ok: false, error: 'Requête trop volumineuse.' }, 413);
  }

  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Format de requête invalide.' }, 400);
  }

  // 3. Honeypot : si le champ caché est rempli, c'est un bot. Succès silencieux.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return fakeSuccess();
  }

  // 4. Time check : timestamp posé par JS au chargement
  const ts = Number(body._ts ?? 0);
  if (ts > 0) {
    const elapsed = Date.now() - ts;
    if (elapsed < MIN_FILL_TIME_MS || elapsed > MAX_FILL_TIME_MS) {
      return fakeSuccess();
    }
  }
  // Si _ts est absent ou non numérique, on n'invalide pas (no-JS users légitimes),
  // mais le rate limiter et le honeypot offrent déjà des barrières.

  // 5. Rate limiting par fingerprint (IP+UA hashé)
  const fp = getClientFingerprint(request);
  if (rateLimiter.hit(`contact:${fp}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW)) {
    return json(
      { ok: false, error: 'Trop d\'envois successifs. Réessayez dans quelques minutes.' },
      429
    );
  }

  // 6. Extraction et validation
  const last_name = trim(body.last_name);
  const first_name = trim(body.first_name);
  const contact_email = trim(body.contact_email);
  const contact_phone = trim(body.contact_phone);
  const contact_postal = trim(body.contact_postal);
  const subject = trim(body.subject);
  const service_interest = trim(body.service_interest);
  const message = trim(body.message);

  const errors: Record<string, string> = {};

  if (!last_name) errors.last_name = 'Votre nom est requis.';
  if (last_name.length > 200) errors.last_name = 'Nom trop long.';
  if (first_name.length > 200) errors.first_name = 'Prénom trop long.';
  if (contact_phone.length > 50) errors.contact_phone = 'Téléphone trop long.';
  if (contact_postal.length > 500) errors.contact_postal = 'Adresse trop longue.';

  if (!contact_email && !contact_phone && !contact_postal) {
    errors.contact_method = 'Renseignez au moins un moyen de contact (email, téléphone ou adresse).';
  }
  if (contact_email && !isValidEmail(contact_email)) {
    errors.contact_email = 'Email invalide.';
  }

  if (subject !== 'service' && subject !== 'divers') {
    errors.subject = 'Choisissez un sujet.';
  }

  if (subject === 'service') {
    if (!service_interest || !ALLOWED_SERVICES.has(service_interest)) {
      errors.service_interest = 'Choisissez un service ou cochez « j\'hésite encore ».';
    }
  }

  if (subject === 'divers' && !message) {
    errors.message = 'Décrivez votre demande.';
  }
  if (message.length > 5000) errors.message = 'Message trop long.';

  if (Object.keys(errors).length > 0) {
    return json({ ok: false, errors }, 422);
  }

  // 7. Heuristiques anti-spam sur message + nom + adresse postale (zones libres)
  const freeText = `${message} ${last_name} ${first_name} ${contact_postal}`;
  if (looksLikeSpam(freeText)) {
    // Succès silencieux : on ne dit pas au bot pourquoi on a refusé
    return fakeSuccess();
  }

  const item = {
    last_name,
    first_name: first_name || null,
    contact_email: contact_email || null,
    contact_phone: contact_phone || null,
    contact_postal: contact_postal || null,
    subject,
    service_interest: subject === 'service' ? service_interest : null,
    message: message || null,
  };

  try {
    const r = await fetch(`${DIRECTUS}/items/contact_messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!r.ok) {
      const text = await r.text();
      console.error('Directus contact_messages POST failed', r.status, text);
      return json({ ok: false, error: 'Enregistrement impossible. Réessayez dans un instant.' }, 502);
    }
  } catch (e) {
    console.error('Directus unreachable', e);
    return json({ ok: false, error: 'Service temporairement indisponible.' }, 502);
  }

  return json({ ok: true }, 200);
};

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
