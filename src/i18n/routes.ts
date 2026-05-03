// Carte bilingue des routes. Source unique pour les liens du site et le toggle FR/EN.
// Ajouter une nouvelle route : ajouter une clé ici dans les deux maps, créer les pages,
// puis le toggle de langue saura naturellement faire le mapping.

export type Lang = 'fr' | 'en';

export type RouteKey =
  | 'home'
  | 'creation'
  | 'creationVitrine'
  | 'creationGestion'
  | 'creationEcommerce'
  | 'creationSurMesure'
  | 'maintenance'
  | 'maintenanceEssentiel'
  | 'maintenancePro'
  | 'maintenancePremium'
  | 'maintenanceLegendaire'
  | 'tools'
  | 'mission'
  | 'portfolio'
  | 'blog'
  | 'contact'
  | 'faq'
  | 'legal'
  | 'privacy'
  | 'links';

export const routes: Record<Lang, Record<RouteKey, string>> = {
  fr: {
    home: '/',
    creation: '/creation-web',
    creationVitrine: '/creation-web/vitrine',
    creationGestion: '/creation-web/gestion',
    creationEcommerce: '/creation-web/e-commerce',
    creationSurMesure: '/creation-web/logiciel-sur-mesure',
    maintenance: '/maintenance-web',
    maintenanceEssentiel: '/maintenance-web/essentiel',
    maintenancePro: '/maintenance-web/pro',
    maintenancePremium: '/maintenance-web/premium',
    maintenanceLegendaire: '/maintenance-web/legendaire',
    tools: '/nos-outils',
    mission: '/mission',
    portfolio: '/portfolio',
    blog: '/blog',
    contact: '/contact',
    faq: '/faq',
    legal: '/mentions-legales',
    privacy: '/confidentialite',
    links: '/liens',
  },
  en: {
    home: '/en',
    creation: '/en/web-design',
    creationVitrine: '/en/web-design/showcase',
    creationGestion: '/en/web-design/management',
    creationEcommerce: '/en/web-design/e-commerce',
    creationSurMesure: '/en/web-design/custom-software',
    maintenance: '/en/web-maintenance',
    maintenanceEssentiel: '/en/web-maintenance/essential',
    maintenancePro: '/en/web-maintenance/pro',
    maintenancePremium: '/en/web-maintenance/premium',
    maintenanceLegendaire: '/en/web-maintenance/legendary',
    tools: '/en/our-tools',
    mission: '/en/mission',
    portfolio: '/en/portfolio',
    blog: '/en/blog',
    contact: '/en/contact',
    faq: '/en/faq',
    legal: '/en/legal-notice',
    privacy: '/en/privacy',
    links: '/en/links',
  },
};

// Inverse map : URL → clé. Utilisé pour deviner l'équivalent dans l'autre langue.
function buildInverseMap(): Record<string, RouteKey> {
  const map: Record<string, RouteKey> = {};
  for (const lang of ['fr', 'en'] as Lang[]) {
    for (const [key, path] of Object.entries(routes[lang])) {
      map[path] = key as RouteKey;
    }
  }
  return map;
}

const inverseMap = buildInverseMap();

export function getRouteKey(path: string): RouteKey | null {
  // Match exact d'abord
  if (path in inverseMap) return inverseMap[path];
  // Sinon, plus long préfixe (pour /blog/foo → blog, /nos-outils/x → tools)
  const candidates = Object.keys(inverseMap)
    .filter((k) => k !== '/' && k !== '/en' && (path === k || path.startsWith(k + '/')))
    .sort((a, b) => b.length - a.length);
  return candidates.length > 0 ? inverseMap[candidates[0]] : null;
}

export function getAlternateUrl(path: string, currentLang: Lang): string | null {
  const key = getRouteKey(path);
  if (!key) return null;
  const otherLang: Lang = currentLang === 'fr' ? 'en' : 'fr';
  const otherBase = routes[otherLang][key];
  // Préserve les segments dynamiques (ex: /blog/mon-article)
  const currentBase = routes[currentLang][key];
  if (path === currentBase) return otherBase;
  if (path.startsWith(currentBase + '/')) {
    return otherBase + path.slice(currentBase.length);
  }
  return otherBase;
}

export function detectLang(path: string): Lang {
  return path === '/en' || path.startsWith('/en/') ? 'en' : 'fr';
}

// Hreflang map pour BaseLayout. Génère les 3 entrées (fr, en, x-default).
export function buildHreflang(path: string, currentLang: Lang): { lang: string; href: string }[] {
  const key = getRouteKey(path);
  if (!key) {
    // Fallback : on ne génère que la version courante
    return [{ lang: currentLang, href: path }];
  }
  const fr = routes.fr[key];
  const en = routes.en[key];
  // Pour les routes dynamiques, on essaie de préserver le segment
  const currentBase = routes[currentLang][key];
  const suffix = path === currentBase ? '' : path.slice(currentBase.length);
  return [
    { lang: 'fr', href: fr + suffix },
    { lang: 'en', href: en + suffix },
    { lang: 'x-default', href: fr + suffix },
  ];
}
