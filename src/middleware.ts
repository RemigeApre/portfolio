import { defineMiddleware } from 'astro:middleware';
import { getAccessToken } from '~/lib/admin';

const PROTECTED_PREFIX = '/admin';
const PUBLIC_ADMIN_ROUTES = new Set(['/admin/login']);
const PROTECTED_API_PREFIX = '/api/admin';
const PUBLIC_API_ROUTES = new Set(['/api/admin/login', '/api/admin/logout']);

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;

  const isAdminPage = path.startsWith(PROTECTED_PREFIX) && !PUBLIC_ADMIN_ROUTES.has(path);
  const isAdminApi = path.startsWith(PROTECTED_API_PREFIX) && !PUBLIC_API_ROUTES.has(path);

  if (isAdminPage || isAdminApi) {
    const token = await getAccessToken(context.cookies);
    if (!token) {
      if (isAdminApi) {
        return new Response(JSON.stringify({ ok: false, error: 'unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return context.redirect('/admin/login', 302);
    }
    context.locals.adminToken = token;
  }

  return next();
});
