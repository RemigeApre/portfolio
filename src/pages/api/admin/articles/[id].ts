import type { APIRoute } from 'astro';
import { directusFetch } from '~/lib/admin';

export const prerender = false;

const VALID_MODES = new Set(['now', 'schedule', 'draft']);

function parisAt18(dateStr: string): string {
  const [y, m] = dateStr.split('-').map(Number);
  if (!y || !m) throw new Error('Date invalide');
  const dst = m >= 4 && m <= 10;
  const offset = dst ? '+02:00' : '+01:00';
  return `${dateStr}T18:00:00${offset}`;
}

function ensureParagraphs(html: string | null): string | null {
  if (!html) return null;
  const trimmed = html.trim();
  if (!trimmed) return null;
  if (/<(p|h[1-6]|ul|ol|blockquote|pre|figure|article|section|div)/i.test(trimmed)) {
    return trimmed;
  }
  return trimmed
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/\n/g, '<br />')}</p>`)
    .join('\n');
}

interface Payload {
  title?: string;
  title_en?: string | null;
  excerpt?: string | null;
  excerpt_en?: string | null;
  content?: string | null;
  content_en?: string | null;
  tags?: string[] | null;
  publish_mode?: string;
  publish_date?: string | null;
}

interface Existing {
  status: string;
  date_published: string | null;
}

export const PATCH: APIRoute = async ({ request, params, locals }) => {
  const id = params.id;
  const token = locals.adminToken;
  if (!id || !token) return new Response(JSON.stringify({ ok: false }), { status: 400 });

  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Requête invalide' }), { status: 400 });
  }

  const mode = body.publish_mode ?? 'now';
  if (!VALID_MODES.has(mode)) {
    return new Response(JSON.stringify({ ok: false, error: 'Mode invalide' }), { status: 422 });
  }
  if (mode === 'schedule' && !body.publish_date) {
    return new Response(JSON.stringify({ ok: false, error: 'Date requise pour la programmation' }), { status: 422 });
  }

  // Charger l'existant pour préserver date_published si mode='now' et date déjà passée
  let existing: Existing | null = null;
  try {
    const r = await directusFetch<{ data: Existing }>(
      token,
      `/items/articles/${encodeURIComponent(id)}?fields=status,date_published`
    );
    existing = r.data;
  } catch {
    // continue, on fera le mieux
  }

  let status = 'published';
  let date_published: string | null = null;

  if (mode === 'draft') {
    status = 'draft';
    date_published = existing?.date_published ?? null;
  } else if (mode === 'schedule' && body.publish_date) {
    try {
      date_published = parisAt18(body.publish_date);
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 422 });
    }
  } else {
    // 'now'
    if (existing?.date_published) {
      const existingDate = new Date(existing.date_published).getTime();
      const now = Date.now();
      // Si l'article était déjà publié dans le passé : on garde la date d'origine.
      // Si la date stockée était dans le futur (= article programmé qu'on bascule en "publier maintenant"), on remet à maintenant.
      date_published = existingDate <= now ? existing.date_published : new Date().toISOString();
    } else {
      date_published = new Date().toISOString();
    }
  }

  const update: Record<string, unknown> = {
    status,
    date_published,
  };

  if (typeof body.title === 'string') {
    const t = body.title.trim();
    if (!t) return new Response(JSON.stringify({ ok: false, error: 'Titre requis' }), { status: 422 });
    update.title = t;
  }
  if ('title_en' in body) update.title_en = body.title_en?.trim() || null;
  if ('excerpt' in body) update.excerpt = body.excerpt?.trim() || null;
  if ('excerpt_en' in body) update.excerpt_en = body.excerpt_en?.trim() || null;
  if ('content' in body) update.content = ensureParagraphs(body.content ?? null);
  if ('content_en' in body) update.content_en = ensureParagraphs(body.content_en ?? null);
  if ('tags' in body) update.tags = body.tags && body.tags.length > 0 ? body.tags : null;

  try {
    await directusFetch(token, `/items/articles/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(update),
    });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    console.error('PATCH article', e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 502 });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  const id = params.id;
  const token = locals.adminToken;
  if (!id || !token) return new Response(JSON.stringify({ ok: false }), { status: 400 });

  try {
    await directusFetch(token, `/items/articles/${encodeURIComponent(id)}`, { method: 'DELETE' });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    console.error('DELETE article', e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 502 });
  }
};
