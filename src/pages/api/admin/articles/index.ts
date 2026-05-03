import type { APIRoute } from 'astro';
import { directusFetch } from '~/lib/admin';

export const prerender = false;

const AUTHOR = 'Le Geai · rédaction';
const VALID_MODES = new Set(['now', 'schedule', 'draft']);

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

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

// Approximation DST Paris : UTC+2 d'avril à octobre, UTC+1 le reste.
// Suffisant pour la programmation d'articles. Faux uniquement aux week-ends de bascule.
function parisAt18(dateStr: string): string {
  const [y, m] = dateStr.split('-').map(Number);
  if (!y || !m) throw new Error('Date invalide');
  const dst = m >= 4 && m <= 10;
  const offset = dst ? '+02:00' : '+01:00';
  return `${dateStr}T18:00:00${offset}`;
}

// Si le contenu est en texte brut sans balises de bloc, on enrobe les paragraphes en <p>.
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

async function uniqueSlug(token: string, base: string): Promise<string> {
  if (!base) base = 'sans-titre';
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? base : `${base}-${i + 1}`;
    const r = await directusFetch<{ data: unknown[] }>(
      token,
      `/items/articles?filter[slug][_eq]=${encodeURIComponent(candidate)}&fields=id&limit=1`
    );
    if (!r.data || r.data.length === 0) return candidate;
  }
  // Fallback : suffixer avec un timestamp court
  return `${base}-${Date.now().toString(36)}`;
}

function resolveDateAndStatus(
  mode: string,
  publishDate: string | null
): { status: string; date_published: string | null } {
  if (mode === 'draft') {
    return { status: 'draft', date_published: null };
  }
  if (mode === 'schedule' && publishDate) {
    return { status: 'published', date_published: parisAt18(publishDate) };
  }
  // Default: now
  return { status: 'published', date_published: new Date().toISOString() };
}

export const POST: APIRoute = async ({ request, locals }) => {
  const token = locals.adminToken;
  if (!token) return new Response(JSON.stringify({ ok: false }), { status: 401 });

  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Requête invalide' }), { status: 400 });
  }

  const title = String(body.title ?? '').trim();
  const mode = String(body.publish_mode ?? 'now');

  if (!title) return new Response(JSON.stringify({ ok: false, error: 'Titre requis' }), { status: 422 });
  if (!VALID_MODES.has(mode)) {
    return new Response(JSON.stringify({ ok: false, error: 'Mode de publication invalide' }), { status: 422 });
  }
  if (mode === 'schedule' && !body.publish_date) {
    return new Response(JSON.stringify({ ok: false, error: 'Date requise pour la programmation' }), { status: 422 });
  }

  let dateStatus;
  try {
    dateStatus = resolveDateAndStatus(mode, body.publish_date ?? null);
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 422 });
  }

  const baseSlug = slugify(title);
  const slug = await uniqueSlug(token, baseSlug);

  const item = {
    title,
    title_en: body.title_en?.trim() || null,
    slug,
    author: AUTHOR,
    status: dateStatus.status,
    date_published: dateStatus.date_published,
    excerpt: body.excerpt?.trim() || null,
    excerpt_en: body.excerpt_en?.trim() || null,
    content: ensureParagraphs(body.content ?? null),
    content_en: ensureParagraphs(body.content_en ?? null),
    tags: body.tags && body.tags.length > 0 ? body.tags : null,
  };

  try {
    const r = await directusFetch<{ data: { id: string | number } }>(
      token,
      '/items/articles',
      { method: 'POST', body: JSON.stringify(item) }
    );
    return new Response(JSON.stringify({ ok: true, id: r.data.id, slug }), { status: 200 });
  } catch (e) {
    console.error('POST article', e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 502 });
  }
};
