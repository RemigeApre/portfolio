// Strings d'UI utilisées par les composants partagés (Nav, Footer, FormuleDetail, etc.).
// Les pages elles-mêmes ont leur contenu en dur dans les fichiers FR et EN respectifs,
// car le contenu éditorial diffère trop pour être traduit champ par champ.

import type { Lang } from './routes';

export interface UiStrings {
  nav: {
    creation: string;
    maintenance: string;
    tools: string;
    portfolio: string;
    blog: string;
    mission: string;
    contact: string;
    home: string;
    openMenu: string;
    closeMenu: string;
    skipToContent: string;
  };
  footer: {
    services: string;
    secondary: string;
    creation: string;
    maintenance: string;
    mission: string;
    tools: string;
    portfolio: string;
    blog: string;
    faq: string;
    contact: string;
    links: string;
    legal: string;
    privacy: string;
    rights: string;
    legalForm: string;
  };
  formule: {
    backCreation: string;
    backMaintenance: string;
    positionCreation: (i: number, total: number) => string;
    positionMaintenance: (i: number, total: number) => string;
    compositionTitleCreation: string;
    compositionTitleMaintenance: string;
    conditionsTitle: string;
    ctaTitle: string;
    ctaLead: string;
    ctaPrimary: string;
    ctaGhostCreation: string;
    ctaGhostMaintenance: string;
    pagerPrev: string;
    pagerNext: string;
    breadcrumbAriaLabel: string;
    pagerAriaLabel: string;
    conditionsCreation: string[];
    conditionsMaintenance: string[];
  };
  common: {
    learnMore: string;
    getInTouch: string;
    languageVersion: string;
    pageNotFound: string;
    backHome: string;
  };
}

export const ui: Record<Lang, UiStrings> = {
  fr: {
    nav: {
      creation: 'Création web',
      maintenance: 'Maintenance web',
      tools: 'Nos outils',
      portfolio: 'Portfolio',
      blog: 'Blog',
      mission: 'Mission',
      contact: 'Contact',
      home: 'Accueil',
      openMenu: 'Ouvrir le menu',
      closeMenu: 'Fermer le menu',
      skipToContent: 'Aller au contenu',
    },
    footer: {
      services: 'Services',
      secondary: 'Liens secondaires',
      creation: 'Création web',
      maintenance: 'Maintenance',
      mission: 'Mission',
      tools: 'Nos outils',
      portfolio: 'Portfolio',
      blog: 'Blog',
      faq: 'FAQ',
      contact: 'Contact',
      links: 'Liens',
      legal: 'Mentions légales',
      privacy: 'Confidentialité',
      rights: 'tous droits réservés.',
      legalForm: 'Micro-entreprise, TVA non applicable, art. 293 B du CGI.',
    },
    formule: {
      backCreation: 'Toutes les formules',
      backMaintenance: 'Tous les niveaux',
      positionCreation: (i, total) => `Formule ${i} sur ${total}`,
      positionMaintenance: (i, total) => `Niveau ${i} sur ${total}`,
      compositionTitleCreation: 'Ce qui est compris',
      compositionTitleMaintenance: 'Inclus chaque mois',
      conditionsTitle: 'Conditions',
      ctaTitle: 'Échangeons sur votre projet',
      ctaLead:
        'Le premier rendez-vous est offert. Décrivez votre besoin, nous reviendrons avec un cadrage clair.',
      ctaPrimary: 'Demander un cadrage',
      ctaGhostCreation: 'Voir toutes les formules',
      ctaGhostMaintenance: 'Voir tous les niveaux',
      pagerPrev: 'Précédent',
      pagerNext: 'Suivant',
      breadcrumbAriaLabel: "Fil d'Ariane",
      pagerAriaLabel: 'Naviguer entre les formules',
      conditionsCreation: [
        'Acompte 30 % à la signature, paiement par paliers.',
        'Tarifs nets, TVA non applicable, art. 293 B du CGI.',
        'Premier rendez-vous offert.',
      ],
      conditionsMaintenance: [
        'Hébergement et nom de domaine inclus.',
        'Engagement 12 mois, tacite reconduction.',
        'Tarifs nets, TVA non applicable, art. 293 B du CGI.',
      ],
    },
    common: {
      learnMore: 'En savoir plus',
      getInTouch: 'Nous écrire',
      languageVersion: 'English version',
      pageNotFound: 'Page introuvable',
      backHome: "Retour à l'accueil",
    },
  },
  en: {
    nav: {
      creation: 'Web design',
      maintenance: 'Web maintenance',
      tools: 'Our tools',
      portfolio: 'Portfolio',
      blog: 'Blog',
      mission: 'Mission',
      contact: 'Contact',
      home: 'Home',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      skipToContent: 'Skip to content',
    },
    footer: {
      services: 'Services',
      secondary: 'Secondary links',
      creation: 'Web design',
      maintenance: 'Maintenance',
      mission: 'Mission',
      tools: 'Our tools',
      portfolio: 'Portfolio',
      blog: 'Blog',
      faq: 'FAQ',
      contact: 'Contact',
      links: 'Links',
      legal: 'Legal notice',
      privacy: 'Privacy',
      rights: 'all rights reserved.',
      legalForm: 'Micro-entreprise, VAT not applicable, art. 293 B of the French CGI.',
    },
    formule: {
      backCreation: 'All packages',
      backMaintenance: 'All levels',
      positionCreation: (i, total) => `Package ${i} of ${total}`,
      positionMaintenance: (i, total) => `Level ${i} of ${total}`,
      compositionTitleCreation: 'What is included',
      compositionTitleMaintenance: 'Included every month',
      conditionsTitle: 'Conditions',
      ctaTitle: 'Let us discuss your project',
      ctaLead:
        'The first conversation is offered. Tell us what you need, we shall come back with a clear scope.',
      ctaPrimary: 'Request a scope',
      ctaGhostCreation: 'View all packages',
      ctaGhostMaintenance: 'View all levels',
      pagerPrev: 'Previous',
      pagerNext: 'Next',
      breadcrumbAriaLabel: 'Breadcrumb',
      pagerAriaLabel: 'Navigate between packages',
      conditionsCreation: [
        '30 % deposit on signature, payment in stages.',
        'Net prices, VAT not applicable, art. 293 B of the French CGI.',
        'First conversation offered.',
      ],
      conditionsMaintenance: [
        'Hosting and domain name included.',
        '12-month engagement, tacit renewal.',
        'Net prices, VAT not applicable, art. 293 B of the French CGI.',
      ],
    },
    common: {
      learnMore: 'Learn more',
      getInTouch: 'Get in touch',
      languageVersion: 'Version française',
      pageNotFound: 'Page not found',
      backHome: 'Back to home',
    },
  },
};

export function t(lang: Lang): UiStrings {
  return ui[lang];
}
