// Helpers i18n simples pour les pages Astro.
// Ré-exporte les fonctions de routes pour que les pages n'aient qu'un import.

export { detectLang, getAlternateUrl, getRouteKey, buildHreflang, routes } from '~/i18n/routes';
export type { Lang, RouteKey } from '~/i18n/routes';
export { t, ui } from '~/i18n/ui';
export type { UiStrings } from '~/i18n/ui';
