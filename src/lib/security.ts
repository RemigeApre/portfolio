// Helpers de sécurité partagés : rate limiting, fingerprinting, heuristiques anti-spam,
// vérification Origin. Aucune dépendance externe, mémoire locale au process.
//
// Note : sur une infra multi-instances, remplacer le Map par un store partagé (Redis).
// Pour notre VPS single-instance, c'est largement suffisant.

import { createHash, randomBytes } from 'node:crypto';

// Sel secret. En prod on lit depuis l'env, en dev on génère un sel par démarrage.
const SECRET_SALT = import.meta.env.SECURITY_SALT
  ?? process.env.SECURITY_SALT
  ?? randomBytes(16).toString('hex');

// ── Fingerprint ───────────────────────────────────────────────
// Hache IP + User-Agent + sel. Irréversible (SHA-256), conforme à la politique
// de confidentialité du site qui parle d'empreinte technique anti-spam.
export function getClientFingerprint(request: Request, headers?: Headers): string {
  const h = headers ?? request.headers;
  const ip =
    h.get('cf-connecting-ip')
    ?? h.get('x-real-ip')
    ?? h.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? 'unknown';
  const ua = h.get('user-agent') ?? 'none';
  return createHash('sha256').update(`${ip}|${ua}|${SECRET_SALT}`).digest('hex').slice(0, 32);
}

// ── Rate limiter en mémoire ───────────────────────────────────
interface Window {
  count: number;
  firstAt: number;
  // Pour compteur de tentatives échouées (login)
  failures?: number;
}

class InMemoryRateLimiter {
  private store = new Map<string, Window>();
  private lastSweep = Date.now();
  private sweepInterval = 5 * 60 * 1000; // ménage toutes les 5 min

  // Ajoute un hit. Retourne true si la limite est dépassée.
  hit(key: string, maxHits: number, windowMs: number): boolean {
    this.maybeSweep(windowMs * 2);
    const now = Date.now();
    const w = this.store.get(key);
    if (!w || now - w.firstAt > windowMs) {
      this.store.set(key, { count: 1, firstAt: now });
      return false;
    }
    w.count += 1;
    return w.count > maxHits;
  }

  // Pour login : compte les échecs séparément. Retourne true si bloqué.
  recordFailure(key: string, maxFailures: number, windowMs: number): boolean {
    this.maybeSweep(windowMs * 2);
    const now = Date.now();
    const w = this.store.get(key);
    if (!w || now - w.firstAt > windowMs) {
      this.store.set(key, { count: 0, firstAt: now, failures: 1 });
      return false;
    }
    w.failures = (w.failures ?? 0) + 1;
    return w.failures >= maxFailures;
  }

  isBlocked(key: string, maxFailures: number, windowMs: number): boolean {
    const w = this.store.get(key);
    if (!w) return false;
    if (Date.now() - w.firstAt > windowMs) return false;
    return (w.failures ?? 0) >= maxFailures;
  }

  // À appeler sur succès pour réinitialiser le compteur d'échecs.
  reset(key: string): void {
    this.store.delete(key);
  }

  private maybeSweep(maxAge: number): void {
    const now = Date.now();
    if (now - this.lastSweep < this.sweepInterval) return;
    this.lastSweep = now;
    for (const [k, w] of this.store) {
      if (now - w.firstAt > maxAge) this.store.delete(k);
    }
  }
}

export const rateLimiter = new InMemoryRateLimiter();

// ── Origin check ──────────────────────────────────────────────
// Vérifie que le POST vient bien de notre origine (anti-CSRF en défense en profondeur).
export function checkOrigin(request: Request, allowedHosts: string[]): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // Lecture de l'host attendu : on accepte tout host présent dans la requête.
  // Dev local et prod sont gérés par allowedHosts.
  const sourceUrl = origin ?? referer;
  if (!sourceUrl) return false;
  try {
    const u = new URL(sourceUrl);
    return allowedHosts.some((h) => u.host === h || u.host.endsWith('.' + h));
  } catch {
    return false;
  }
}

// Liste par défaut des hosts autorisés (dev + prod).
export const DEFAULT_ALLOWED_HOSTS = [
  'localhost:3000',
  'localhost',
  '127.0.0.1:3000',
  '127.0.0.1',
  'legeai-informatique.fr',
  'www.legeai-informatique.fr',
];

// ── Heuristiques anti-spam ────────────────────────────────────
// Retourne true si le contenu ressemble à du spam.
export function looksLikeSpam(text: string): boolean {
  if (!text) return false;
  const t = text.toLowerCase();

  // Trop de liens : plus de 3 URLs dans un message court
  const urlMatches = t.match(/https?:\/\/|www\./g);
  if (urlMatches && urlMatches.length > 3) return true;

  // Présence de [url=...] ou BBCode (signature classique de spambots forums)
  if (/\[\/?url|\[\/?link/i.test(text)) return true;

  // Mots-clés spam les plus fréquents (FR + EN)
  const spamWords = [
    'viagra', 'cialis', 'casino', 'porno',
    'crypto investment', 'bitcoin doubler', 'forex signal',
    'seo guarantee', 'guaranteed seo', 'seo services cheap',
    'buy backlinks', 'cheap backlinks',
    'work from home', 'make money fast',
  ];
  for (const w of spamWords) {
    if (t.includes(w)) return true;
  }

  // Ratio caractères non-alphanumériques très élevé (souvent du spam ASCII art ou des injections)
  const nonAlpha = (text.match(/[^a-zA-Z0-9\s.,!?;:'"()\-éèàùâêîôûçëïüœæ\n]/g) ?? []).length;
  if (text.length > 50 && nonAlpha / text.length > 0.4) return true;

  return false;
}

// ── Email validation ──────────────────────────────────────────
// Validation stricte d'email. Plus restrictif que la regex HTML5.
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  // Pas d'espace, un seul @, TLD au moins 2 lettres, pas de caractères de contrôle
  return /^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]{1,253}\.[a-zA-Z]{2,24}$/.test(email);
}

// ── Délai constant randomisé (anti-timing attack) ─────────────
// Utilisé sur les endpoints sensibles (login) pour empêcher de mesurer
// si un email existe ou pas via le temps de réponse.
export function safeDelay(minMs = 150, maxMs = 400): Promise<void> {
  const ms = minMs + Math.random() * (maxMs - minMs);
  return new Promise((resolve) => setTimeout(resolve, ms));
}
