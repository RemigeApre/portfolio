import type { APIRoute } from 'astro';
import { directusFetch } from '~/lib/admin';

export const prerender = false;

const VALID_STATUSES = new Set(['new', 'read', 'processed', 'archived']);

export const PATCH: APIRoute = async ({ request, params, locals }) => {
  const id = params.id;
  const token = locals.adminToken;
  if (!id || !token) {
    return new Response(JSON.stringify({ ok: false }), { status: 400 });
  }

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid body' }), { status: 400 });
  }

  if (!body.status || !VALID_STATUSES.has(body.status)) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid status' }), { status: 400 });
  }

  try {
    await directusFetch(token, `/items/contact_messages/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: body.status }),
    });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    console.error('PATCH message status', e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 502 });
  }
};
