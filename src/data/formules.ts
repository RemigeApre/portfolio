// Source de vérité : public/documents/plaquette_le_geai_informatique.pdf (édition mai 2026).
// Ne pas inventer ; modifier ici si la plaquette évolue.

import type { Lang } from '~/i18n/routes';

export type FormuleCategory = 'creation' | 'maintenance';

export interface Formule {
  // Slug FR (utilisé pour les routes FR et comme identifiant interne)
  slug: string;
  // Slug EN (utilisé pour les routes /en/...)
  slug_en: string;
  // Nom FR (souvent identique à EN, mais peut différer)
  name: string;
  name_en: string;
  category: FormuleCategory;
  // Tarif court pour tableau comparatif
  tarifShort: string;
  tarifShort_en: string;
  // Tarif long pour le hero de la page détail
  tarifLong: string;
  tarifLong_en: string;
  // "3 semaines" / "3 weeks", etc.
  delai: string;
  delai_en: string;
  // Phrase courte pour la colonne "Composition" du tableau
  compositionShort: string;
  compositionShort_en: string;
  // Liste détaillée pour la page de détail
  composition: string[];
  composition_en: string[];
}

export const creationFormules: Formule[] = [
  {
    slug: 'vitrine',
    slug_en: 'showcase',
    name: 'Vitrine',
    name_en: 'Showcase',
    category: 'creation',
    tarifShort: '900 €',
    tarifShort_en: '€900',
    tarifLong: '900 €',
    tarifLong_en: '€900',
    delai: '3 semaines',
    delai_en: '3 weeks',
    compositionShort:
      "2 à 3 pages personnalisées, référencement local, adaptation mobile, RGPD, formation et documentation, 2 allers-retours.",
    compositionShort_en:
      '2 to 3 bespoke pages, local SEO, mobile adaptation, GDPR compliance, training and documentation, 2 review rounds.',
    composition: [
      '2 à 3 pages personnalisées',
      'Référencement local',
      'Adaptation mobile',
      'Conformité RGPD',
      'Formation et documentation',
      '2 allers-retours de relecture',
    ],
    composition_en: [
      '2 to 3 bespoke pages',
      'Local search optimisation',
      'Mobile adaptation',
      'GDPR compliance',
      'Training and documentation',
      '2 rounds of review',
    ],
  },
  {
    slug: 'gestion',
    slug_en: 'management',
    name: 'Gestion',
    name_en: 'Management',
    category: 'creation',
    tarifShort: 'dès 2 800 €',
    tarifShort_en: 'from €2,800',
    tarifLong: 'dès 2 800 €',
    tarifLong_en: 'from €2,800',
    delai: '6 à 8 semaines',
    delai_en: '6 to 8 weeks',
    compositionShort:
      "Vitrine + espace administrateur sécurisé, 1 à 3 fonctionnalités interactives (réservations, planning, espace client, stocks), formation administrateur.",
    compositionShort_en:
      'Showcase + secure admin area, 1 to 3 interactive features (bookings, scheduling, client area, stock), administrator training.',
    composition: [
      'Tout le contenu de la formule Vitrine',
      'Espace administrateur sécurisé',
      '1 à 3 fonctionnalités interactives au choix (réservations, planning, espace client, gestion des stocks)',
      'Formation administrateur',
    ],
    composition_en: [
      'Everything in the Showcase package',
      'Secure administrator area',
      '1 to 3 interactive features of your choice (bookings, scheduling, client area, stock management)',
      'Administrator training',
    ],
  },
  {
    slug: 'e-commerce',
    slug_en: 'e-commerce',
    name: 'E-commerce',
    name_en: 'E-commerce',
    category: 'creation',
    tarifShort: 'dès 6 500 €',
    tarifShort_en: 'from €6,500',
    tarifLong: 'dès 6 500 €',
    tarifLong_en: 'from €6,500',
    delai: '10 semaines',
    delai_en: '10 weeks',
    compositionShort:
      "Gestion + catalogue produits, panier sur mesure, paiement sécurisé via PayPal/Stripe, gestion commandes et livraisons, tableau de bord ventes.",
    compositionShort_en:
      'Management + product catalogue, bespoke cart, secure payment via PayPal or Stripe, order and delivery handling, sales dashboard.',
    composition: [
      'Tout le contenu de la formule Gestion',
      'Catalogue produits',
      'Panier sur mesure',
      'Paiement sécurisé via PayPal ou Stripe',
      'Gestion des commandes et des livraisons',
      'Tableau de bord des ventes',
    ],
    composition_en: [
      'Everything in the Management package',
      'Product catalogue',
      'Bespoke shopping cart',
      'Secure payment via PayPal or Stripe',
      'Order and delivery handling',
      'Sales dashboard',
    ],
  },
  {
    slug: 'logiciel-sur-mesure',
    slug_en: 'custom-software',
    name: 'Logiciel sur mesure',
    name_en: 'Custom software',
    category: 'creation',
    tarifShort: 'sur devis',
    tarifShort_en: 'on quote',
    tarifLong: 'Sur devis',
    tarifLong_en: 'On quote',
    delai: 'selon le projet',
    delai_en: 'depending on the work',
    compositionShort:
      "Application web ou logiciel de bureau, conçu sur cahier des charges, développement par phases avec validations intermédiaires, documentation et formation.",
    compositionShort_en:
      'Web application or desktop software, designed from a written brief, phased development with intermediate validations, documentation and training.',
    composition: [
      'Application web ou logiciel de bureau',
      'Conception sur cahier des charges',
      'Développement par phases, avec validations intermédiaires',
      'Documentation et formation',
    ],
    composition_en: [
      'Web application or desktop software',
      'Designed from a written brief',
      'Phased development with intermediate validations',
      'Documentation and training',
    ],
  },
];

export const maintenanceFormules: Formule[] = [
  {
    slug: 'essentiel',
    slug_en: 'essential',
    name: 'Essentiel',
    name_en: 'Essential',
    category: 'maintenance',
    tarifShort: '39 € / mois',
    tarifShort_en: '€39 / month',
    tarifLong: '39 € par mois',
    tarifLong_en: '€39 per month',
    delai: 'engagement 12 mois',
    delai_en: '12-month engagement',
    compositionShort:
      "Domaine, hébergement, SSL, sauvegarde mensuelle de la structure, surveillance, correction des incidents bloquants.",
    compositionShort_en:
      'Domain, hosting, SSL, monthly backup of the structure, monitoring, fixing of blocking incidents.',
    composition: [
      'Nom de domaine',
      'Hébergement',
      'Certificat SSL',
      'Sauvegarde mensuelle de la structure',
      'Surveillance',
      'Correction des incidents bloquants',
    ],
    composition_en: [
      'Domain name',
      'Hosting',
      'SSL certificate',
      'Monthly backup of the structure',
      'Monitoring',
      'Fixing of blocking incidents',
    ],
  },
  {
    slug: 'pro',
    slug_en: 'pro',
    name: 'Pro',
    name_en: 'Pro',
    category: 'maintenance',
    tarifShort: '149 € / mois',
    tarifShort_en: '€149 / month',
    tarifLong: '149 € par mois',
    tarifLong_en: '€149 per month',
    delai: 'engagement 12 mois',
    delai_en: '12-month engagement',
    compositionShort:
      "Essentiel + 2 h d'amélioration mensuelle sur demande (design, fonctionnalités, contenu, SEO).",
    compositionShort_en:
      'Essential + 2 hours of monthly improvement on request (design, features, content, SEO).',
    composition: [
      'Tout le contenu de la formule Essentiel',
      "2 h d'amélioration mensuelle sur demande, sur le design, les fonctionnalités, le contenu ou le SEO",
    ],
    composition_en: [
      'Everything in the Essential package',
      '2 hours of monthly improvement on request, on design, features, content or SEO',
    ],
  },
  {
    slug: 'premium',
    slug_en: 'premium',
    name: 'Premium',
    name_en: 'Premium',
    category: 'maintenance',
    tarifShort: '299 € / mois',
    tarifShort_en: '€299 / month',
    tarifLong: '299 € par mois',
    tarifLong_en: '€299 per month',
    delai: 'engagement 12 mois',
    delai_en: '12-month engagement',
    compositionShort:
      "Pro + sauvegarde complète (structure et contenu) + 4 h supplémentaires + 1 h de formation utilisateur + intervention sous 24 h ouvrées.",
    compositionShort_en:
      'Pro + full backup (structure and content) + 4 extra hours + 1 hour of user training + intervention within 24 working hours.',
    composition: [
      'Tout le contenu de la formule Pro',
      'Sauvegarde complète, structure et contenu',
      "4 h supplémentaires d'amélioration mensuelle (soit 6 h au total)",
      "1 h de formation utilisateur par mois",
      'Intervention sous 24 h ouvrées',
    ],
    composition_en: [
      'Everything in the Pro package',
      'Full backup, structure and content',
      '4 additional hours of monthly improvement (6 hours total)',
      '1 hour of user training per month',
      'Intervention within 24 working hours',
    ],
  },
  {
    slug: 'legendaire',
    slug_en: 'legendary',
    name: 'Légendaire',
    name_en: 'Legendary',
    category: 'maintenance',
    tarifShort: '499 € / mois',
    tarifShort_en: '€499 / month',
    tarifLong: '499 € par mois',
    tarifLong_en: '€499 per month',
    delai: 'engagement 12 mois',
    delai_en: '12-month engagement',
    compositionShort:
      "Premium + 1 h par semaine de gestion active du contenu (ajouts, mises à jour, utilisateurs) + priorité maximale.",
    compositionShort_en:
      'Premium + 1 hour per week of active content management (additions, updates, users) + maximum priority.',
    composition: [
      'Tout le contenu de la formule Premium',
      "1 h par semaine de gestion active du contenu, ajouts, mises à jour, utilisateurs",
      'Priorité maximale',
    ],
    composition_en: [
      'Everything in the Premium package',
      '1 hour per week of active content management, additions, updates, users',
      'Maximum priority',
    ],
  },
];

export function getFormule(category: FormuleCategory, slug: string, lang: Lang = 'fr'): Formule | undefined {
  const list = category === 'creation' ? creationFormules : maintenanceFormules;
  const slugField = lang === 'en' ? 'slug_en' : 'slug';
  return list.find((f) => f[slugField] === slug);
}

export function getNeighbors(category: FormuleCategory, slug: string, lang: Lang = 'fr'): {
  prev: Formule | null;
  next: Formule | null;
} {
  const list = category === 'creation' ? creationFormules : maintenanceFormules;
  const slugField = lang === 'en' ? 'slug_en' : 'slug';
  const idx = list.findIndex((f) => f[slugField] === slug);
  return {
    prev: idx > 0 ? list[idx - 1] : null,
    next: idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null,
  };
}

// Helpers pour accéder aux champs localisés
export function fName(f: Formule, lang: Lang): string {
  return lang === 'en' ? f.name_en : f.name;
}
export function fSlug(f: Formule, lang: Lang): string {
  return lang === 'en' ? f.slug_en : f.slug;
}
export function fTarifShort(f: Formule, lang: Lang): string {
  return lang === 'en' ? f.tarifShort_en : f.tarifShort;
}
export function fTarifLong(f: Formule, lang: Lang): string {
  return lang === 'en' ? f.tarifLong_en : f.tarifLong;
}
export function fDelai(f: Formule, lang: Lang): string {
  return lang === 'en' ? f.delai_en : f.delai;
}
export function fCompositionShort(f: Formule, lang: Lang): string {
  return lang === 'en' ? f.compositionShort_en : f.compositionShort;
}
export function fComposition(f: Formule, lang: Lang): string[] {
  return lang === 'en' ? f.composition_en : f.composition;
}
