import type { APIRoute } from 'astro';
import { directusFetch } from '~/lib/admin';

export const prerender = false;

const VALID_OS = new Set(['windows', 'macos', 'linux', 'any']);
const VALID_FORMATS = new Set(['exe', 'msi', 'zip', 'dmg', 'appimage', 'deb', 'targz']);
const VALID_BROWSERS = new Set(['chrome', 'firefox', 'edge', 'safari', 'brave', 'opera']);
const VALID_APP_TYPES = new Set(['desktop', 'web', 'extension']);
const VALID_STATUSES = new Set(['draft', 'published', 'archived']);

interface DownloadInput { os?: string; format?: string; file?: string; size_bytes?: number | null; }
interface ExtLinkInput { browser?: string; url?: string; }
interface FeatureInput { title_fr?: string; title_en?: string; description_fr?: string; description_en?: string; }
interface ScreenshotInput { file?: string; caption_fr?: string; caption_en?: string; }

interface Payload {
  app_type?: string;
  name_fr?: string;
  tagline_fr?: string | null;
  tagline_en?: string | null;
  version?: string | null;
  license?: string | null;
  description_fr?: string | null;
  description_en?: string | null;
  cover?: string | null;
  screenshots?: ScreenshotInput[] | null;
  features?: FeatureInput[] | null;
  downloads?: DownloadInput[] | null;
  web_url?: string | null;
  extension_links?: ExtLinkInput[] | null;
  github_url?: string | null;
  changelog?: string | null;
  usage_wiki_fr?: string | null;
  usage_wiki_en?: string | null;
  status?: string;
  sort?: number | null;
}

function slugify(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

async function uniqueSlug(token: string, base: string): Promise<string> {
  if (!base) base = 'outil';
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? base : `${base}-${i + 1}`;
    const r = await directusFetch<{ data: unknown[] }>(
      token,
      `/items/tools?filter[slug][_eq]=${encodeURIComponent(candidate)}&fields=id&limit=1`
    );
    if (!r.data || r.data.length === 0) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`;
}

function sanitizeDownloads(input: DownloadInput[] | null | undefined): DownloadInput[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((d) => d && typeof d.file === 'string' && d.file.length > 0)
    .map((d) => ({
      os: VALID_OS.has(d.os ?? '') ? d.os! : 'any',
      format: VALID_FORMATS.has(d.format ?? '') ? d.format! : 'zip',
      file: d.file!,
      size_bytes: typeof d.size_bytes === 'number' && d.size_bytes > 0 ? d.size_bytes : null,
    }));
}

function sanitizeExtLinks(input: ExtLinkInput[] | null | undefined): ExtLinkInput[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((e) => e && typeof e.url === 'string' && e.url.trim().length > 0)
    .map((e) => ({
      browser: VALID_BROWSERS.has(e.browser ?? '') ? e.browser! : 'chrome',
      url: e.url!.trim(),
    }));
}

function sanitizeFeatures(input: FeatureInput[] | null | undefined): FeatureInput[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((f) => f && typeof f.title_fr === 'string' && f.title_fr.trim().length > 0)
    .map((f) => ({
      title_fr: f.title_fr!.trim(),
      title_en: f.title_en?.trim() || undefined,
      description_fr: f.description_fr?.trim() || undefined,
      description_en: f.description_en?.trim() || undefined,
    }));
}

function sanitizeScreenshots(input: ScreenshotInput[] | null | undefined): ScreenshotInput[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((s) => s && typeof s.file === 'string' && s.file.length > 0)
    .map((s) => ({
      file: s.file!,
      caption_fr: s.caption_fr?.trim() || undefined,
      caption_en: s.caption_en?.trim() || undefined,
    }));
}

function nullIfEmpty(s: string | null | undefined): string | null {
  if (s == null) return null;
  const t = String(s).trim();
  return t.length > 0 ? t : null;
}

export const POST: APIRoute = async ({ request, locals }) => {
  const token = locals.adminToken;
  if (!token) return new Response(JSON.stringify({ ok: false }), { status: 401 });

  let body: Payload;
  try { body = await request.json(); }
  catch { return new Response(JSON.stringify({ ok: false, error: 'Requête invalide' }), { status: 400 }); }

  const name_fr = String(body.name_fr ?? '').trim();
  const status = String(body.status ?? 'draft');
  const app_type = String(body.app_type ?? 'desktop');

  if (!name_fr) return new Response(JSON.stringify({ ok: false, error: 'Nom requis' }), { status: 422 });
  if (!VALID_STATUSES.has(status)) return new Response(JSON.stringify({ ok: false, error: 'Statut invalide' }), { status: 422 });
  if (!VALID_APP_TYPES.has(app_type)) return new Response(JSON.stringify({ ok: false, error: "Type d'application invalide" }), { status: 422 });

  const slug = await uniqueSlug(token, slugify(name_fr));

  const item = {
    app_type,
    name_fr,
    name_en: name_fr, // sync brand
    slug,
    tagline_fr: nullIfEmpty(body.tagline_fr),
    tagline_en: nullIfEmpty(body.tagline_en),
    version: nullIfEmpty(body.version),
    license: nullIfEmpty(body.license),
    description_fr: nullIfEmpty(body.description_fr),
    description_en: nullIfEmpty(body.description_en),
    cover: body.cover || null,
    screenshots: sanitizeScreenshots(body.screenshots),
    features: sanitizeFeatures(body.features),
    downloads: sanitizeDownloads(body.downloads),
    web_url: nullIfEmpty(body.web_url),
    extension_links: sanitizeExtLinks(body.extension_links),
    github_url: nullIfEmpty(body.github_url),
    changelog: nullIfEmpty(body.changelog),
    usage_wiki_fr: nullIfEmpty(body.usage_wiki_fr),
    usage_wiki_en: nullIfEmpty(body.usage_wiki_en),
    status,
    sort: typeof body.sort === 'number' ? body.sort : null,
    download_count: 0,
  };

  try {
    const r = await directusFetch<{ data: { id: string | number } }>(
      token, '/items/tools',
      { method: 'POST', body: JSON.stringify(item) }
    );
    return new Response(JSON.stringify({ ok: true, id: r.data.id, slug }), { status: 200 });
  } catch (e) {
    console.error('POST tool', e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 502 });
  }
};
