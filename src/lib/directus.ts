// Client Directus en lecture publique. Aucun token nécessaire :
// les permissions publiques sont configurées par directus/setup.mjs.

const INTERNAL_URL = import.meta.env.DIRECTUS_INTERNAL_URL ?? 'http://directus:8055';
export const PUBLIC_URL = import.meta.env.DIRECTUS_PUBLIC_URL ?? 'http://localhost:8055';

export interface Article {
  id: string;
  status: 'draft' | 'published' | 'archived';
  title: string;
  title_en?: string | null;
  slug: string;
  author?: string | null;
  date_published?: string | null;
  tags?: string[] | null;
  cover?: string | null;
  excerpt?: string | null;
  excerpt_en?: string | null;
  content?: string | null;
  content_en?: string | null;
  date_created?: string;
  date_updated?: string;
}

export interface Faq {
  id: string;
  status: 'draft' | 'published' | 'archived';
  question: string;
  question_en?: string | null;
  answer: string;
  answer_en?: string | null;
  category?: string | null;
  category_en?: string | null;
  sort?: number | null;
}

export interface Realisation {
  id: string;
  status: 'draft' | 'published' | 'archived';
  title: string;
  title_en?: string | null;
  slug: string;
  client?: string | null;
  url?: string | null;
  tags?: string[] | null;
  cover?: string | null;
  description?: string | null;
  description_en?: string | null;
  sort?: number | null;
}

import type { Lang } from '~/i18n/routes';

// Helpers : retourne la version localisée avec fallback FR si EN vide.
export function articleTitle(a: Article, lang: Lang): string {
  return lang === 'en' ? (a.title_en?.trim() || a.title) : a.title;
}
export function articleExcerpt(a: Article, lang: Lang): string | null {
  if (lang === 'en') return a.excerpt_en?.trim() || a.excerpt || null;
  return a.excerpt || null;
}
export function articleContent(a: Article, lang: Lang): string | null {
  if (lang === 'en') return a.content_en?.trim() || a.content || null;
  return a.content || null;
}
export function articleHasTranslation(a: Article, lang: Lang): boolean {
  if (lang === 'fr') return Boolean(a.title?.trim());
  return Boolean(a.title_en?.trim() && a.content_en?.trim());
}

export function faqQuestion(f: Faq, lang: Lang): string {
  return lang === 'en' ? (f.question_en?.trim() || f.question) : f.question;
}
export function faqAnswer(f: Faq, lang: Lang): string {
  return lang === 'en' ? (f.answer_en?.trim() || f.answer) : f.answer;
}
export function faqCategory(f: Faq, lang: Lang): string | null {
  if (lang === 'en') return f.category_en?.trim() || f.category || null;
  return f.category || null;
}

export function realisationTitle(r: Realisation, lang: Lang): string {
  return lang === 'en' ? (r.title_en?.trim() || r.title) : r.title;
}
export function realisationDescription(r: Realisation, lang: Lang): string | null {
  if (lang === 'en') return r.description_en?.trim() || r.description || null;
  return r.description || null;
}

export interface ToolDownload {
  os: 'windows' | 'macos' | 'linux' | 'any';
  format: string;
  file: string;
  size_bytes?: number | null;
}

export interface ExtensionLink {
  browser: 'chrome' | 'firefox' | 'edge' | 'safari' | 'brave' | 'opera';
  url: string;
}

export type AppType = 'desktop' | 'web' | 'extension';

export interface ToolFeature {
  title_fr: string;
  title_en?: string | null;
  description_fr?: string | null;
  description_en?: string | null;
}

export interface ToolScreenshot {
  file: string;
  caption_fr?: string | null;
  caption_en?: string | null;
}

export interface Tool {
  id: string | number;
  status: 'draft' | 'published' | 'archived';
  app_type: AppType;
  slug: string;
  name_fr: string;
  name_en?: string | null;
  tagline_fr?: string | null;
  tagline_en?: string | null;
  version?: string | null;
  license?: string | null;
  description_fr?: string | null;
  description_en?: string | null;
  cover?: string | null;
  screenshots?: ToolScreenshot[] | null;
  features?: ToolFeature[] | null;
  downloads?: ToolDownload[] | null;
  download_count?: number | null;
  web_url?: string | null;
  extension_links?: ExtensionLink[] | null;
  github_url?: string | null;
  changelog?: string | null;
  usage_wiki_fr?: string | null;
  usage_wiki_en?: string | null;
  sort?: number | null;
  date_updated?: string | null;
}

async function get<T>(path: string): Promise<T[]> {
  const res = await fetch(`${INTERNAL_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Directus ${path} -> ${res.status}`);
  }
  const json = await res.json();
  return (json.data ?? []) as T[];
}

// Filtre $NOW : Directus ne retourne que les articles dont la date de publication est passée.
// Permet la programmation d'un article : tant que la date n'est pas atteinte, l'article est invisible
// même s'il est en statut "published".
const NOW_FILTER = '&filter[date_published][_lte]=$NOW';

export async function getArticles(): Promise<Article[]> {
  return get<Article>(`/items/articles?sort=-date_published&limit=100${NOW_FILTER}`);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const list = await get<Article>(
    `/items/articles?filter[slug][_eq]=${encodeURIComponent(slug)}&limit=1${NOW_FILTER}`
  );
  return list[0] ?? null;
}

export async function getFaqs(): Promise<Faq[]> {
  return get<Faq>('/items/faq?sort=sort,question&limit=200');
}

export async function getRealisations(): Promise<Realisation[]> {
  return get<Realisation>('/items/realisations?sort=sort&limit=200');
}

export async function getTools(): Promise<Tool[]> {
  return get<Tool>('/items/tools?sort=sort,name_fr&limit=100');
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  const list = await get<Tool>(
    `/items/tools?filter[slug][_eq]=${encodeURIComponent(slug)}&limit=1`
  );
  return list[0] ?? null;
}

export function assetUrl(id: string | null | undefined): string | null {
  if (!id) return null;
  return `${PUBLIC_URL}/assets/${id}`;
}

// Cache HTTP standard pour pages alimentees par Directus.
// s-maxage : duree en cache partage (NPM/CDN) en secondes
// stale-while-revalidate : sert l'ancienne version pendant la revalidation
export function setCacheHeaders(headers: Headers, sMaxAge = 600, swr = 86400): void {
  headers.set(
    'Cache-Control',
    `public, s-maxage=${sMaxAge}, stale-while-revalidate=${swr}`
  );
}
