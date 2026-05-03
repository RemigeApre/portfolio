# Le Geai Informatique — Brief projet

Ce fichier est la source de vérité pour tout agent travaillant sur ce repo. À lire avant toute modification.

## Stack

- **Front** : Astro 5 + Tailwind CSS, mode hybride (SSG par défaut, SSR pour les pages alimentées par le CMS).
- **CMS** : Directus 11 (headless), gère blog, FAQ, portfolio.
- **BDD** : PostgreSQL 16 (utilisée uniquement par Directus).
- **Orchestration** : Docker Compose (`docker-compose.yml` pour le dev, `docker-compose.prod.yml` en override pour le VPS).
- **Hébergement prod** : OVH VPS, derrière Nginx Proxy Manager (réseau Docker `proxy`).

Les versions des frameworks utilisés ici peuvent dépasser ta date de cutoff. **Lis la doc dans `node_modules/<framework>/dist/docs/` (ou la doc en ligne) avant d'écrire du code.**

## Scope des services commerciaux

Le Geai Informatique propose **uniquement deux catégories** :

1. **Création web** : Vitrine (900 €), Gestion (dès 2 800 €), E-commerce (dès 6 500 €), Logiciel sur mesure (sur devis).
2. **Maintenance web** : Essentiel (39 €/mois), Pro (149 €/mois), Premium (299 €/mois), Légendaire (499 €/mois).

**Ne mentionne aucun autre service** (Microsoft 365, data engineering, formation). Ils existent en interne mais ne sont pas commercialisés actuellement.

## Source de vérité pour les offres

[public/documents/plaquette_le_geai_informatique.pdf](public/documents/plaquette_le_geai_informatique.pdf) est la **référence absolue** pour les compositions, tarifs, délais. Ne jamais inventer ; en cas d'info manquante, demander.

## Ton éditorial

- **Pas d'em dash** (—), jamais. Utiliser virgules, points-virgules, deux-points.
- **Pas de bullets** dans le texte courant, sauf listes techniques explicites.
- Phrases courtes et nettes, pas longues et fleuries.
- Vocabulaire d'origine latine ou ancienne plutôt qu'anglicismes : préférer "ouvrage" à "projet" quand cohérent, "façonner" à "créer", "limpide" à "facile à utiliser".
- Pas de comparaison aux concurrents, pas de négations rhétoriques (éviter "sans templates", "pas de site préfabriqué").
- Affirmer plutôt que justifier.

## Identité visuelle

### Palette

**Site (utilisé actuellement, dark theme)** :
| Nom | Hex |
|---|---|
| Noir | `#1A1A1A` |
| Doré (texte) | `#C9A961` |
| Doré profond (décoratif) | `#8B6F2A` |
| Beige clair | `#F5F2EC` |

**Charte officielle Le Geai Éditions** (PDF charte) — à terme, aligner Le Geai Informatique sur ces noms et hex :
| Nom poétique | Hex |
|---|---|
| Sable des rêves perdus | `#af8f3c` |
| Rouge antique | `#b74d34` |
| Vert de minuit | `#1f2c23` |
| Lune de lait | `#f7f0de` |

Le doré du site (`#C9A961`) est légèrement plus clair que le sable officiel (`#af8f3c`) pour passer le contraste WCAG AA sur fond noir. Le sable officiel s'utilise pour l'imprimé ou les fonds clairs. Variables CSS : `--color-dore` (texte) et `--color-dore-brand` (décoratif).

### Typographie
**EB Garamond** (Google Font, libre, distribuée via @fontsource). Famille Garamond traditionnelle, optimisée pour la lecture à l'écran (contrairement à Cormorant Garamond qui est une display). Graisses utilisées : 400, 500, 700, en Regular et Italic. Le corps de texte est en weight 500 par défaut pour gagner en lisibilité.

### Logo
[public/LeGeai_logo_monochrome.svg](public/LeGeai_logo_monochrome.svg) : geai héraldique à deux têtes avec livre ouvert au centre.

### Devise (maison mère)
**Obscuritas nutrit flammam** (« L'obscurité nourrit la flamme »).
À utiliser avec parcimonie, sur les pages institutionnelles. Tirée de la charte officielle de Le Geai Éditions ([Charte graphique - notre identité.pdf](Charte%20graphique%20-%20notre%20identité.pdf), à la racine).
Devises secondaires de la maison mère, utilisables avec encore plus de parcimonie : *Memento Mori*, *Carpe diem quam minimum credula postero*.

## Structure des routes

```
/                              Accueil
/liens                         Linktree interne
/creation-web                  Page mère + tableau comparatif
  /vitrine
  /gestion
  /e-commerce
  /logiciel-sur-mesure
/maintenance-web               Page mère + tableau comparatif
  /essentiel
  /pro
  /premium
  /legendaire
/projet                        Le Geai Éditions, valeurs, histoire
/portfolio                     Réalisations (Directus)
/blog                          Articles (Directus)
  /[slug]
/faq                           Questions fréquentes (Directus)
/contact                       Formulaire et coordonnées
/mentions-legales
/confidentialite               RGPD
```

**Menu principal** (header) : Accueil, Création web, Maintenance web, Projet, Portfolio, Blog, Contact.
Les sous-pages des formules sont accessibles depuis les pages mères, pas depuis le menu.
FAQ et Linktree sont accessibles depuis le footer.

Pages en stand-by (à activer plus tard) : Partenariats, Atelier.

## Contenu géré dans Directus

Trois collections seulement :

- **articles** (blog) : titre, slug, date, auteur, contenu (markdown ou WYSIWYG), image illustration, statut (brouillon/publié), tags.
- **faq** : question, réponse, catégorie, ordre, statut.
- **realisations** (portfolio) : titre, client, description, image, lien public, tags, ordre.

Les autres pages (commerciales, institutionnelles) sont **statiques en code**, modifiées via fichiers Astro.

## Coordonnées

- Site : `legeai-informatique.fr`
- Téléphone : 04 82 53 25 64
- Email : `administration@legeai-editions.com`
- Statut : micro-entreprise, TVA non applicable, art. 293 B du CGI.

## Priorité absolue : SEO

- Pages commerciales en SSG strict, zéro JS inutile.
- Métadonnées par page (title, description, OpenGraph, Twitter Card).
- JSON-LD structuré (LocalBusiness sur l'accueil, Service sur les pages d'offres, Article sur le blog).
- `sitemap.xml` et `robots.txt` générés automatiquement.
- `llms.txt` à maintenir à jour.
- Lighthouse cible : 100/100/100/100.
