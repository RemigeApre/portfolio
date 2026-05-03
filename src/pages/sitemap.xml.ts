import type { APIRoute } from 'astro';
import { creationFormules, maintenanceFormules } from '~/data/formules';
import { getArticles, getRealisations, getTools } from '~/lib/directus';
import { routes } from '~/lib/i18n';

export const prerender = false;

const SITE = 'https://www.legeai-informatique.fr';

interface UrlEntry {
  loc: string;
  lastmod?: string;
  priority: string;
  changefreq: string;
  alternates?: { lang: string; href: string }[];
}

// Construit les liens hreflang réciproques pour une route bilingue.
function pair(frPath: string, enPath: string): { lang: string; href: string }[] {
  return [
    { lang: 'fr', href: SITE + frPath },
    { lang: 'en', href: SITE + enPath },
    { lang: 'x-default', href: SITE + frPath },
  ];
}

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async () => {
  const urls: UrlEntry[] = [];

  // Pages statiques bilingues — chaque entrée FR + EN avec hreflang réciproques.
  const bilingualKeys = [
    { key: 'home' as const, priority: '1.0', changefreq: 'weekly' },
    { key: 'creation' as const, priority: '0.9', changefreq: 'monthly' },
    { key: 'maintenance' as const, priority: '0.9', changefreq: 'monthly' },
    { key: 'mission' as const, priority: '0.7', changefreq: 'yearly' },
    { key: 'tools' as const, priority: '0.8', changefreq: 'weekly' },
    { key: 'portfolio' as const, priority: '0.8', changefreq: 'weekly' },
    { key: 'blog' as const, priority: '0.8', changefreq: 'weekly' },
    { key: 'faq' as const, priority: '0.7', changefreq: 'monthly' },
    { key: 'contact' as const, priority: '0.7', changefreq: 'yearly' },
    { key: 'links' as const, priority: '0.4', changefreq: 'monthly' },
    { key: 'legal' as const, priority: '0.2', changefreq: 'yearly' },
    { key: 'privacy' as const, priority: '0.2', changefreq: 'yearly' },
  ];

  for (const { key, priority, changefreq } of bilingualKeys) {
    const fr = routes.fr[key];
    const en = routes.en[key];
    const alternates = pair(fr, en);
    urls.push({ loc: fr, priority, changefreq, alternates });
    urls.push({ loc: en, priority: String(parseFloat(priority) - 0.1), changefreq, alternates });
  }

  // Formules création (FR + EN avec slugs traduits)
  for (const f of creationFormules) {
    const fr = `/creation-web/${f.slug}`;
    const en = `/en/web-design/${f.slug_en}`;
    const alts = pair(fr, en);
    urls.push({ loc: fr, priority: '0.7', changefreq: 'monthly', alternates: alts });
    urls.push({ loc: en, priority: '0.6', changefreq: 'monthly', alternates: alts });
  }
  for (const f of maintenanceFormules) {
    const fr = `/maintenance-web/${f.slug}`;
    const en = `/en/web-maintenance/${f.slug_en}`;
    const alts = pair(fr, en);
    urls.push({ loc: fr, priority: '0.7', changefreq: 'monthly', alternates: alts });
    urls.push({ loc: en, priority: '0.6', changefreq: 'monthly', alternates: alts });
  }

  try {
    const articles = await getArticles();
    for (const a of articles) {
      const fr = `/blog/${a.slug}`;
      const en = `/en/blog/${a.slug}`;
      const alts = pair(fr, en);
      urls.push({
        loc: fr,
        lastmod: a.date_updated ?? a.date_published ?? undefined,
        priority: '0.6',
        changefreq: 'monthly',
        alternates: alts,
      });
      urls.push({
        loc: en,
        lastmod: a.date_updated ?? a.date_published ?? undefined,
        priority: '0.5',
        changefreq: 'monthly',
        alternates: alts,
      });
    }
  } catch (e) {
    console.warn('sitemap: articles fetch failed', e);
  }

  try {
    const realisations = await getRealisations();
    for (const r of realisations) {
      urls.push({
        loc: `/portfolio#${r.slug}`,
        priority: '0.5',
        changefreq: 'monthly',
      });
    }
  } catch (e) {
    console.warn('sitemap: realisations fetch failed', e);
  }

  try {
    const tools = await getTools();
    for (const t of tools) {
      const fr = `/nos-outils/${t.slug}`;
      const en = `/en/our-tools/${t.slug}`;
      const alts = pair(fr, en);
      urls.push({
        loc: fr,
        lastmod: t.date_updated ?? undefined,
        priority: '0.7',
        changefreq: 'weekly',
        alternates: alts,
      });
      urls.push({
        loc: en,
        lastmod: t.date_updated ?? undefined,
        priority: '0.6',
        changefreq: 'weekly',
        alternates: alts,
      });
    }
  } catch (e) {
    console.warn('sitemap: tools fetch failed', e);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map((u) => {
    const altLines = (u.alternates ?? [])
      .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${escape(a.href)}" />`)
      .join('\n');
    return `  <url>
    <loc>${escape(SITE + u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${escape(u.lastmod)}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${altLines ? `\n${altLines}` : ''}
  </url>`;
  })
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
};
