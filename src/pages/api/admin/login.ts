import type { APIRoute } from 'astro';
import { login, setAuthCookies } from '~/lib/admin';
import {
  getClientFingerprint,
  rateLimiter,
  checkOrigin,
  DEFAULT_ALLOWED_HOSTS,
  isValidEmail,
  safeDelay,
} from '~/lib/security';

export const prerender = false;

// Brute-force : 5 tentatives échouées par fingerprint dans une fenêtre de 15 min
// puis blocage. Les tentatives réussies réinitialisent le compteur.
const MAX_FAILURES = 5;
const FAILURE_WINDOW = 15 * 60_000;

// Limites de payload (anti-flood)
const MAX_EMAIL_LEN = 254;
const MAX_PASSWORD_LEN = 256;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  // Délai constant randomisé sur toutes les réponses (anti-timing)
  const delayPromise = safeDelay(150, 350);

  // 1. Origin check (défense en profondeur)
  if (!checkOrigin(request, DEFAULT_ALLOWED_HOSTS)) {
    await delayPromise;
    return redirect('/admin/login?error=invalid', 303);
  }

  // 2. Rate limiting : si déjà bloqué, on rejette immédiatement (avec délai)
  const fp = getClientFingerprint(request);
  const fpKey = `login:${fp}`;
  if (rateLimiter.isBlocked(fpKey, MAX_FAILURES, FAILURE_WINDOW)) {
    await delayPromise;
    return redirect('/admin/login?error=blocked', 303);
  }

  // 3. Limite de taille du body
  const lenHeader = request.headers.get('content-length');
  if (lenHeader && Number(lenHeader) > 4_000) {
    await delayPromise;
    return redirect('/admin/login?error=invalid', 303);
  }

  // 4. Lecture et validation des champs
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    await delayPromise;
    return redirect('/admin/login?error=invalid', 303);
  }

  const email = String(form.get('email') ?? '').trim().slice(0, MAX_EMAIL_LEN);
  const password = String(form.get('password') ?? '').slice(0, MAX_PASSWORD_LEN);

  if (!email || !password) {
    await delayPromise;
    return redirect('/admin/login?error=missing', 303);
  }

  // Validation email stricte avant tout appel Directus (rejette les payloads malformés)
  if (!isValidEmail(email)) {
    rateLimiter.recordFailure(fpKey, MAX_FAILURES, FAILURE_WINDOW);
    await delayPromise;
    return redirect('/admin/login?error=invalid', 303);
  }

  // 5. Tentative d'authentification
  try {
    const auth = await login(email, password);
    setAuthCookies(cookies, auth);
    rateLimiter.reset(fpKey); // succès : on remet à zéro le compteur d'échecs
    await delayPromise;
    return redirect('/admin', 303);
  } catch {
    const blockedNow = rateLimiter.recordFailure(fpKey, MAX_FAILURES, FAILURE_WINDOW);
    await delayPromise;
    return redirect(blockedNow ? '/admin/login?error=blocked' : '/admin/login?error=invalid', 303);
  }
};
