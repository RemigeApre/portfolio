import type { APIRoute } from 'astro';

export const prerender = false;

const INTERNAL = import.meta.env.DIRECTUS_INTERNAL_URL ?? 'http://directus:8055';

// Reçoit un fichier en multipart/form-data, le forwarde à Directus /files,
// renvoie l'UUID Directus + métadonnées (filename, size, type).
export const POST: APIRoute = async ({ request, locals }) => {
  const token = locals.adminToken;
  if (!token) {
    return new Response(JSON.stringify({ ok: false, error: 'unauthorized' }), { status: 401 });
  }

  let incoming: FormData;
  try {
    incoming = await request.formData();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Format de requête invalide.' }), { status: 400 });
  }

  const file = incoming.get('file');
  if (!(file instanceof File)) {
    return new Response(JSON.stringify({ ok: false, error: 'Aucun fichier reçu.' }), { status: 400 });
  }

  // Construire un FormData propre pour Directus
  const out = new FormData();
  out.append('file', file, file.name);

  try {
    const r = await fetch(`${INTERNAL}/files`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      // NOTE : ne PAS définir Content-Type, fetch s'en charge avec le boundary.
      body: out,
    });
    if (!r.ok) {
      const text = await r.text();
      console.error('Directus /files POST failed', r.status, text);
      const msg = r.status === 413
        ? 'Fichier trop volumineux pour Directus.'
        : 'Upload impossible. Réessayez.';
      return new Response(JSON.stringify({ ok: false, error: msg }), { status: 502 });
    }
    const j = await r.json();
    return new Response(JSON.stringify({
      ok: true,
      id: j.data.id,
      filename: j.data.filename_download ?? file.name,
      size: j.data.filesize ?? file.size,
      type: j.data.type ?? file.type ?? null,
    }), { status: 200 });
  } catch (e) {
    console.error('Upload exception', e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 502 });
  }
};
