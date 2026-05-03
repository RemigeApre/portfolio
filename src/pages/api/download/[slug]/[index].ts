import type { APIRoute } from 'astro';
import { login } from '~/lib/admin';

export const prerender = false;

const INTERNAL = import.meta.env.DIRECTUS_INTERNAL_URL ?? 'http://directus:8055';
const PUBLIC_URL = import.meta.env.DIRECTUS_PUBLIC_URL ?? 'http://localhost:8055';
const ADMIN_EMAIL = import.meta.env.DIRECTUS_ADMIN_EMAIL ?? '';
const ADMIN_PASSWORD = import.meta.env.DIRECTUS_ADMIN_PASSWORD ?? '';

interface ToolDownload {
  os: string;
  format: string;
  file: string;
  size_bytes?: number;
}

interface Tool {
  id: string | number;
  slug: string;
  status: string;
  download_count: number;
  downloads: ToolDownload[] | null;
}

// Token serveur mis en cache simple (renouvellement à expiration).
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getServiceToken(): Promise<string | null> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.value;
  }
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn('No admin credentials in env, download counter will not increment');
    return null;
  }
  try {
    const auth = await login(ADMIN_EMAIL, ADMIN_PASSWORD);
    cachedToken = { value: auth.access_token, expiresAt: Date.now() + (auth.expires ?? 60_000) };
    return auth.access_token;
  } catch (e) {
    console.error('Service login failed', e);
    return null;
  }
}

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;
  const idxStr = params.index;
  if (!slug || !idxStr) return new Response('Not found', { status: 404 });
  const idx = Number.parseInt(idxStr, 10);
  if (Number.isNaN(idx) || idx < 0) return new Response('Not found', { status: 404 });

  // Lecture publique du tool (filtré status=published par les permissions Directus)
  let tool: Tool | null = null;
  try {
    const r = await fetch(
      `${INTERNAL}/items/tools?filter[slug][_eq]=${encodeURIComponent(slug)}&fields=id,slug,status,download_count,downloads&limit=1`
    );
    if (r.ok) {
      const j = await r.json();
      tool = (j.data ?? [])[0] ?? null;
    }
  } catch (e) {
    console.error('Tool fetch failed', e);
  }

  if (!tool) return new Response('Tool not found', { status: 404 });
  const dl = (tool.downloads ?? [])[idx];
  if (!dl?.file) return new Response('Download not found', { status: 404 });

  // Incrémentation du compteur, best-effort, non bloquante pour l'utilisateur.
  // Le téléchargement marche même si l'incrément échoue.
  void (async () => {
    const token = await getServiceToken();
    if (!token) return;
    try {
      await fetch(`${INTERNAL}/items/tools/${tool!.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ download_count: (tool!.download_count ?? 0) + 1 }),
      });
    } catch (e) {
      console.error('Counter increment failed', e);
    }
  })();

  // Redirection vers le fichier (lecture publique sur directus_files déjà autorisée).
  return new Response(null, {
    status: 302,
    headers: {
      Location: `${PUBLIC_URL}/assets/${dl.file}?download`,
      'Cache-Control': 'no-store',
    },
  });
};
