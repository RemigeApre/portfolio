// Helpers d'authentification pour le dashboard /admin.
// Utilise les comptes Directus (admin role + permissions complètes).

import type { AstroCookies } from 'astro';

const DIRECTUS = import.meta.env.DIRECTUS_INTERNAL_URL ?? 'http://directus:8055';

const ACCESS_COOKIE = 'lg_admin_access';
const REFRESH_COOKIE = 'lg_admin_refresh';

export interface DirectusAuth {
  access_token: string;
  refresh_token: string;
  expires: number; // ms
}

async function callDirectusAuth(path: string, body: object): Promise<DirectusAuth> {
  const r = await fetch(`${DIRECTUS}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`Auth ${path} -> ${r.status}: ${text}`);
  }
  const json = await r.json();
  return json.data;
}

export function login(email: string, password: string): Promise<DirectusAuth> {
  return callDirectusAuth('/auth/login', { email, password });
}

export function refresh(refreshToken: string): Promise<DirectusAuth> {
  return callDirectusAuth('/auth/refresh', { refresh_token: refreshToken, mode: 'json' });
}

export function setAuthCookies(cookies: AstroCookies, auth: DirectusAuth): void {
  const secure = import.meta.env.PROD;
  cookies.set(ACCESS_COOKIE, auth.access_token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: Math.max(60, Math.floor(auth.expires / 1000)),
  });
  cookies.set(REFRESH_COOKIE, auth.refresh_token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookies(cookies: AstroCookies): void {
  cookies.delete(ACCESS_COOKIE, { path: '/' });
  cookies.delete(REFRESH_COOKIE, { path: '/' });
}

export async function getAccessToken(cookies: AstroCookies): Promise<string | null> {
  const access = cookies.get(ACCESS_COOKIE)?.value;
  if (access) return access;

  const refreshTok = cookies.get(REFRESH_COOKIE)?.value;
  if (!refreshTok) return null;

  try {
    const auth = await refresh(refreshTok);
    setAuthCookies(cookies, auth);
    return auth.access_token;
  } catch {
    clearAuthCookies(cookies);
    return null;
  }
}

export interface CurrentUser {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
}

export async function getCurrentUser(token: string): Promise<CurrentUser | null> {
  try {
    const r = await fetch(`${DIRECTUS}/users/me?fields=id,email,first_name,last_name`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!r.ok) return null;
    const j = await r.json();
    return j.data;
  } catch {
    return null;
  }
}

export async function directusFetch<T = unknown>(
  token: string,
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const r = await fetch(`${DIRECTUS}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`Directus ${path} -> ${r.status}: ${text}`);
  }
  if (r.status === 204) return null as T;
  return r.json() as Promise<T>;
}

export const COOKIES = { ACCESS: ACCESS_COOKIE, REFRESH: REFRESH_COOKIE };
