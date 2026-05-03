import type { APIRoute } from 'astro';
import { directusFetch } from '~/lib/admin';

export const prerender = false;

const VALID_STATUSES = new Set(['draft', 'published', 'archived']);

export const PATCH: APIRoute = async ({ request, params, locals }) => {
  const id = params.id;
  const token = locals.adminToken;
  if (!id || !token) return new Response(JSON.stringify({ ok: false }), { status: 400 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid body' }), { status: 400 });
  }

  const update: Record<string, unknown> = {};
  if (typeof body.question === 'string') update.question = body.question.trim();
  if ('question_en' in body) {
    update.question_en = typeof body.question_en === 'string' ? (body.question_en.trim() || null) : null;
  }
  if (typeof body.answer === 'string') update.answer = body.answer.trim();
  if ('answer_en' in body) {
    update.answer_en = typeof body.answer_en === 'string' ? (body.answer_en.trim() || null) : null;
  }
  if (typeof body.status === 'string') {
    if (!VALID_STATUSES.has(body.status)) {
      return new Response(JSON.stringify({ ok: false, error: 'Statut invalide' }), { status: 422 });
    }
    update.status = body.status;
  }
  if ('category' in body) update.category = body.category ?? null;
  if ('category_en' in body) {
    update.category_en = typeof body.category_en === 'string' ? (body.category_en.trim() || null) : null;
  }
  if ('sort' in body) update.sort = body.sort ?? null;

  try {
    await directusFetch(token, `/items/faq/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(update),
    });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    console.error('PATCH faq', e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 502 });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  const id = params.id;
  const token = locals.adminToken;
  if (!id || !token) return new Response(JSON.stringify({ ok: false }), { status: 400 });

  try {
    await directusFetch(token, `/items/faq/${encodeURIComponent(id)}`, { method: 'DELETE' });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    console.error('DELETE faq', e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 502 });
  }
};
