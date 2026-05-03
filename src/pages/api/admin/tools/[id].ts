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

function nullIfEmpty(s: unknown): string | null {
  if (s == null) return null;
  const t = String(s).trim();
  return t.length > 0 ? t : null;
}

export const PATCH: APIRoute = async ({ request, params, locals }) => {
  const id = params.id;
  const token = locals.adminToken;
  if (!id || !token) return new Response(JSON.stringify({ ok: false }), { status: 400 });

  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return new Response(JSON.stringify({ ok: false, error: 'Requête invalide' }), { status: 400 }); }

  const update: Record<string, unknown> = {};

  if (typeof body.app_type === 'string') {
    if (!VALID_APP_TYPES.has(body.app_type)) {
      return new Response(JSON.stringify({ ok: false, error: "Type d'application invalide" }), { status: 422 });
    }
    update.app_type = body.app_type;
  }
  if (typeof body.name_fr === 'string') {
    const v = body.name_fr.trim();
    if (!v) return new Response(JSON.stringify({ ok: false, error: 'Nom requis' }), { status: 422 });
    update.name_fr = v;
    update.name_en = v;
  }
  if ('tagline_fr' in body) update.tagline_fr = nullIfEmpty(body.tagline_fr);
  if ('tagline_en' in body) update.tagline_en = nullIfEmpty(body.tagline_en);
  if ('version' in body) update.version = nullIfEmpty(body.version);
  if ('license' in body) update.license = nullIfEmpty(body.license);
  if ('description_fr' in body) update.description_fr = nullIfEmpty(body.description_fr);
  if ('description_en' in body) update.description_en = nullIfEmpty(body.description_en);
  if ('cover' in body) update.cover = body.cover || null;
  if ('screenshots' in body) update.screenshots = sanitizeScreenshots(body.screenshots as ScreenshotInput[]);
  if ('features' in body) update.features = sanitizeFeatures(body.features as FeatureInput[]);
  if ('downloads' in body) update.downloads = sanitizeDownloads(body.downloads as DownloadInput[]);
  if ('web_url' in body) update.web_url = nullIfEmpty(body.web_url);
  if ('extension_links' in body) update.extension_links = sanitizeExtLinks(body.extension_links as ExtLinkInput[]);
  if ('github_url' in body) update.github_url = nullIfEmpty(body.github_url);
  if ('changelog' in body) update.changelog = nullIfEmpty(body.changelog);
  if ('usage_wiki_fr' in body) update.usage_wiki_fr = nullIfEmpty(body.usage_wiki_fr);
  if ('usage_wiki_en' in body) update.usage_wiki_en = nullIfEmpty(body.usage_wiki_en);
  if ('sort' in body) update.sort = typeof body.sort === 'number' ? body.sort : null;
  if (typeof body.status === 'string') {
    if (!VALID_STATUSES.has(body.status)) {
      return new Response(JSON.stringify({ ok: false, error: 'Statut invalide' }), { status: 422 });
    }
    update.status = body.status;
  }

  try {
    await directusFetch(token, `/items/tools/${encodeURIComponent(id)}`, {
      method: 'PATCH', body: JSON.stringify(update),
    });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    console.error('PATCH tool', e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 502 });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  const id = params.id;
  const token = locals.adminToken;
  if (!id || !token) return new Response(JSON.stringify({ ok: false }), { status: 400 });

  try {
    await directusFetch(token, `/items/tools/${encodeURIComponent(id)}`, { method: 'DELETE' });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    console.error('DELETE tool', e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 502 });
  }
};
