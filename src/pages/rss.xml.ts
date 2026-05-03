import type { APIRoute } from 'astro';
import { getArticles } from '~/lib/directus';

export const prerender = false;

const SITE = 'https://www.legeai-informatique.fr';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const cdata = (s: string) => `<![CDATA[${s.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;

export const GET: APIRoute = async () => {
  let articles: Awaited<ReturnType<typeof getArticles>> = [];
  try {
    articles = await getArticles();
  } catch {
    articles = [];
  }

  const lastBuild = new Date().toUTCString();

  const items = articles
    .map((a) => {
      const url = `${SITE}/blog/${a.slug}`;
      const pubDate = a.date_published ? new Date(a.date_published).toUTCString() : lastBuild;
      const cats = (a.tags ?? []).map((t) => `      <category>${escape(t)}</category>`).join('\n');
      return `    <item>
      <title>${escape(a.title)}</title>
      <link>${escape(url)}</link>
      <guid isPermaLink="true">${escape(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>contact@legeai-informatique.fr (${escape(a.author ?? 'Le Geai · rédaction')})</author>
      <description>${cdata(a.excerpt ?? a.title)}</description>${cats ? '\n' + cats : ''}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Le Geai Informatique — Le journal</title>
    <link>${SITE}/blog</link>
    <description>Articles, retours et notes sur l'artisanat numérique.</description>
    <language>fr-FR</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=86400',
    },
  });
};
