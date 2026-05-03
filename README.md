# Le Geai Informatique — Site web

Site institutionnel `legeai-informatique.fr`. Stack : **Astro + Tailwind + Directus + Postgres**, le tout dans **Docker**.

> Le brief permanent du projet (ton, palette, scope, structure des routes) est dans [AGENTS.md](AGENTS.md). À lire avant toute modification de contenu.

## Sommaire

- [Lancer en local pour développer](#lancer-en-local-pour-développer)
- [Déployer en production sur le VPS](#déployer-en-production-sur-le-vps)
- [Architecture](#architecture)
- [Dépannage](#dépannage)

---

## Lancer en local pour développer

### Ce qu'il te faut

- **Docker Desktop** installé et démarré. Pour vérifier, ouvre PowerShell et tape `docker --version` : tu dois voir un numéro de version.
- **Git**.

Tu n'as **pas besoin** d'installer Node.js, npm, ni Postgres séparément. Tout tourne dans Docker.

### Étape 1 — récupérer le code

Si c'est ta première fois :

```powershell
git clone https://github.com/remigeapre/portfolio.git c:\dev\portfolio
cd c:\dev\portfolio
```

Si tu l'as déjà :

```powershell
cd c:\dev\portfolio
git pull
```

### Étape 2 — créer ton fichier `.env`

```powershell
Copy-Item .env.example .env
```

Pour le dev local, tu peux laisser les valeurs telles quelles. Le fichier `.env` est ignoré par Git, il ne sera jamais commité.

### Étape 3 — démarrer la stack

```powershell
docker compose up -d
```

La première fois, ça télécharge les images Postgres et Directus. Compte 5 à 10 minutes.

Vérifie que tout tourne :

```powershell
docker compose ps
```

Tu dois voir `db`, `directus` et `web` avec le statut `running`.

> Le service `web` lance `npm install` puis `astro dev` au premier démarrage. Compte 1 à 2 minutes avant que le site réponde sur http://localhost:3000.

### Étape 4 — utiliser les services

| Service | URL | Identifiants |
|---|---|---|
| Site Astro | http://localhost:3000 | (pas d'auth) |
| Directus (CMS) | http://localhost:8055 | `admin@legeai.local` / `dev-password-changemoi` |

### Étape 5 — voir les logs

Pour voir ce qui se passe en temps réel :

```powershell
docker compose logs -f
```

(Ctrl+C pour quitter)

Pour voir les logs d'un seul service :

```powershell
docker compose logs -f directus
```

### Étape 6 — arrêter

```powershell
docker compose down
```

Les données restent dans les volumes Docker, rien n'est perdu, tu peux relancer plus tard.

Pour **tout effacer et repartir de zéro** (volumes inclus) :

```powershell
docker compose down -v
```

### Étape 7 — mettre à jour les images Docker

De temps en temps :

```powershell
docker compose pull
docker compose up -d
```

---

## Déployer en production sur le VPS

> Le VPS héberge **trois containers** : `db` (Postgres), `directus` (CMS), `web` (le site Astro).
> **Nginx Proxy Manager**, déjà installé sur le VPS, sert de portier : il reçoit le trafic depuis Internet et le redirige vers le bon container.

### Avant de commencer

Tu as besoin de :
- Un accès SSH au VPS OVH.
- Que **Nginx Proxy Manager** tourne déjà sur le VPS et expose son réseau Docker `proxy`.
- Que les domaines `legeai-informatique.fr` et `admin.legeai-informatique.fr` pointent vers l'IP du VPS (DNS).

### Étape 1 — première installation (à faire une seule fois)

**1.1.** Connecte-toi en SSH au VPS :

```bash
ssh user@ton-vps.ovh.net
```

**1.2.** Clone le repo dans `/home/portfolio` :

```bash
cd /home
git clone https://github.com/remigeapre/portfolio.git
cd portfolio
```

**1.3.** Crée le fichier `.env` de production :

```bash
cp .env.example .env
nano .env
```

**1.4.** Remplace **toutes** les valeurs par des secrets forts. Génère-les avec :

```bash
# pour DB_PASSWORD et DIRECTUS_ADMIN_PASSWORD
openssl rand -base64 32

# pour DIRECTUS_KEY
openssl rand -hex 16

# pour DIRECTUS_SECRET
openssl rand -hex 32
```

Et règle :

| Variable | Valeur prod |
|---|---|
| `DIRECTUS_ADMIN_EMAIL` | `administration@legeai-editions.com` |
| `DIRECTUS_PUBLIC_URL` | `https://admin.legeai-informatique.fr` |

Sauvegarde : Ctrl+O, Entrée, Ctrl+X.

**Important** : note le `DIRECTUS_ADMIN_PASSWORD` dans un gestionnaire de mots de passe. C'est ton login pour l'interface du CMS.

**1.5.** Démarre la stack avec l'override de production :

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

**1.6.** Vérifie que tout tourne :

```bash
docker compose ps
docker compose logs --tail 30 directus
```

### Étape 2 — configurer Nginx Proxy Manager

Ouvre l'interface NPM (http://ton-vps:81) puis ajoute deux entrées dans **Proxy Hosts** :

**Entrée 1 — Directus (CMS) :**
- Domain Names : `admin.legeai-informatique.fr`
- Scheme : `http`
- Forward Hostname / IP : `directus`
- Forward Port : `8055`
- Block Common Exploits : activé
- SSL : onglet SSL, choisir **Request a new SSL Certificate** (Let's Encrypt), forcer SSL.

**Entrée 2 — Site web :**
- Domain Names : `legeai-informatique.fr`, `www.legeai-informatique.fr`
- Scheme : `http`
- Forward Hostname / IP : `web`
- Forward Port : `3000`
- Block Common Exploits : activé
- SSL : Let's Encrypt, forcer SSL.

> ⚠️ L'entrée 2 ne marchera qu'à partir de l'étape 2 du chantier (quand on aura le service `web`).

### Étape 3 — déployer une mise à jour

À chaque modification du code, depuis ta machine de dev tu pousses sur GitHub. Puis sur le VPS :

```bash
ssh user@ton-vps.ovh.net
cd /home/portfolio
git pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

`--build` reconstruit l'image `web` si le code a changé. Coupure de quelques secondes maximum.

Pour suivre les logs après un déploiement :

```bash
docker compose logs -f web
```

### Étape 3.5 — initialiser le schéma Directus

Une fois `docker compose up` lancé pour la première fois, il faut créer les 3 collections (articles, faq, realisations) dans Directus. Un script idempotent fait ça pour toi :

```powershell
docker compose exec -e DIRECTUS_INTERNAL_URL=http://directus:8055 -e DIRECTUS_ADMIN_EMAIL=$env:DIRECTUS_ADMIN_EMAIL -e DIRECTUS_ADMIN_PASSWORD=$env:DIRECTUS_ADMIN_PASSWORD web node /app/directus/setup.mjs
```

Ce script :
- Crée les 3 collections (articles, faq, realisations) avec leurs champs.
- Configure les permissions de lecture publique sur les items publiés.
- Permet aussi la lecture publique des fichiers uploadés (images d'articles).

À refaire une fois après chaque `docker compose down -v` (qui efface la BDD). Le script est idempotent : tu peux le relancer sans risque, il saute ce qui existe déjà.

### Étape 4 — sauvegarde régulière

Les volumes Docker à sauvegarder sont :
- `db_data` : la base Postgres (contenu Directus).
- `directus_uploads` : les fichiers uploadés depuis le CMS (images d'articles, etc.).

Procédure de backup à mettre en place plus tard (script CRON + dump Postgres + tar des uploads).

### Étape 5 — restaurer ou rollback

Pour revenir à une version précédente :

```bash
cd /home/portfolio
git log --oneline -10        # repère le commit qui marche
git checkout <hash-du-commit>
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Pour repasser sur la dernière version :

```bash
git checkout main
git pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

---

## Architecture

```
                    Internet (visiteurs)
                            │
                            ▼
              ┌─────────────────────────┐
              │  Nginx Proxy Manager     │
              │  (HTTPS, port 80/443)    │
              └────┬─────────────┬──────┘
                   │             │
                   │             │
            ┌──────▼─────┐   ┌──▼────────┐
            │   web      │   │ directus  │
            │   Astro    │   │   CMS     │
            │  :3000     │   │  :8055    │
            └──────┬─────┘   └──┬────────┘
                   │            │
                   └────────┬───┘
                            │
                       ┌────▼────┐
                       │   db    │
                       │ Postgres │
                       │  :5432  │
                       └─────────┘
```

- `web` est un Astro hybride. La majorité des pages (accueil, formules création/maintenance, mentions...) sont **statiques** (pré-rendues, servies en quelques ms). Les pages `/blog`, `/portfolio`, `/faq` sont **rendues à la demande** par le serveur Astro qui interroge Directus, puis cachées 10 min côté HTTP via `Cache-Control: public, s-maxage=600, stale-while-revalidate=86400`.
- `directus` stocke tout dans `db`.
- L'admin va sur https://admin.legeai-informatique.fr pour publier des articles, gérer le portfolio, modifier la FAQ. Les modifications sont visibles publiquement dans la minute (cache HTTP de 10 min max).
- Les pages commerciales et institutionnelles sont en dur dans le code Astro, pas dans Directus.

---

## Dépannage

| Symptôme | Cause | Solution |
|---|---|---|
| `docker compose` n'est pas reconnu | Docker Desktop pas démarré | Lance Docker Desktop, attends "Engine running" |
| Port 8055 déjà pris | Un autre service tourne dessus | `docker compose down`, ou change le port dans `docker-compose.yml` |
| Directus crash au premier démarrage | Postgres pas encore prêt | Attendre 30 secondes, c'est normal au premier `up` |
| Mot de passe admin oublié (dev) | — | `docker compose down -v` puis recommence (efface tout) |
| Mot de passe admin oublié (prod) | — | `docker compose exec directus npx directus users passwd --email <admin-email> --password <nouveau>` |
| Le site ne répond pas en prod | NPM mal configuré ou container down | Vérifier `docker compose ps` et la config NPM |
| Erreur "network proxy not found" en prod | Le réseau `proxy` n'existe pas | NPM doit tourner avant. `docker network ls` pour vérifier. |

---

## Documentation interne

- [AGENTS.md](AGENTS.md) — brief permanent (ton éditorial, palette, scope des services, structure des routes).
- [public/documents/plaquette_le_geai_informatique.pdf](public/documents/plaquette_le_geai_informatique.pdf) — source de vérité pour les offres et tarifs.
- [public/documents/affiche_le_geai_informatique.pdf](public/documents/affiche_le_geai_informatique.pdf) — affiche commerciale.
