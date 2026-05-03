import type { APIRoute } from 'astro';
import { directusFetch } from '~/lib/admin';

export const prerender = false;

const VALID_STATUSES = new Set(['draft', 'published', 'archived']);

export const POST: APIRoute = async ({ request, locals }) => {
  const token = locals.adminToken;
  if (!token) return new Response(JSON.stringify({ ok: false }), { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid body' }), { status: 400 });
  }

  const question = String(body.question ?? '').trim();
  const answer = String(body.answer ?? '').trim();
  const status = String(body.status ?? 'draft');

  if (!question) return new Response(JSON.stringify({ ok: false, error: 'Question requise' }), { status: 422 });
  if (!answer) return new Response(JSON.stringify({ ok: false, error: 'Réponse requise' }), { status: 422 });
  if (!VALID_STATUSES.has(status)) {
    return new Response(JSON.stringify({ ok: false, error: 'Statut invalide' }), { status: 422 });
  }

  const item = {
    question,
    question_en: typeof body.question_en === 'string' ? (body.question_en.trim() || null) : null,
    answer,
    answer_en: typeof body.answer_en === 'string' ? (body.answer_en.trim() || null) : null,
    status,
    category: body.category ?? null,
    category_en: typeof body.category_en === 'string' ? (body.category_en.trim() || null) : null,
    sort: body.sort ?? null,
  };

  try {
    const r = await directusFetch<{ data: { id: string | number } }>(
      token,
      '/items/faq',
      { method: 'POST', body: JSON.stringify(item) }
    );
    return new Response(JSON.stringify({ ok: true, id: r.data.id }), { status: 200 });
  } catch (e) {
    console.error('POST faq', e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 502 });
  }
};
