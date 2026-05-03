import type { APIRoute } from 'astro';
import { clearAuthCookies } from '~/lib/admin';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  clearAuthCookies(cookies);
  return redirect('/admin/login', 303);
};
