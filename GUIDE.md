# Guide — Le Geai Informatique

---

## 1. Lancer en local

### Prerequis

- **Node.js** 20+ (`node -v` pour verifier)
- **npm** 9+ (`npm -v`)

### Etapes

```bash
# 1. Cloner le repo (si pas deja fait)
git clone https://github.com/remigeapre/portfolio.git
cd portfolio

# 2. Installer les dependances
npm install

# 3. Lancer le serveur de developpement
npm run dev
```

Le site est accessible sur **http://localhost:3000**

### Commandes utiles

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de dev avec hot reload |
| `npm run build` | Build de production |
| `npm start` | Lancer le build de production en local |

### En cas de probleme

- **Port 3000 occupe** : `npm run dev -- -p 8080` pour utiliser un autre port
- **Erreur de dependances** : supprimer `node_modules` et relancer `npm install`
- **Cache** : supprimer le dossier `.next` et relancer `npm run dev`

---

## 2. Deployer sur le VPS (OVH + Docker + Nginx Proxy Manager)

### Infra

- **Hebergeur** : OVH VPS (Debian)
- **Chemin du repo** : `/home/portfolio`
- **Repo Git** : `https://github.com/remigeapre/portfolio` (branche `main`)
- **Reseau Docker** : `proxy` (gere par Nginx Proxy Manager)
- **Container** : `portfolio`
- **Port interne** : 3000

### Deployer une mise a jour

Se connecter en SSH au VPS, puis :

```bash
cd /home/portfolio && git pull origin main && docker build -t portfolio . && docker stop portfolio && docker rm portfolio && docker run -d --name portfolio --network proxy --restart unless-stopped portfolio
```

### Ce que ca fait

1. Pull les derniers changements depuis GitHub
2. Build l'image Docker (multi-stage : install + build + runner leger)
3. Arrete et supprime l'ancien container
4. Relance le container sur le reseau `proxy`

Coupure de ~30 secondes pendant le build.

### Premier deploiement (migration depuis l'ancien site HTML)

L'ancien site utilisait `nginx:alpine` sur le port **80**.
Le nouveau site utilise `node:20-alpine` sur le port **3000**.

Apres le premier deploiement du nouveau site, il faut mettre a jour Nginx Proxy Manager :

1. Se connecter a l'interface Nginx Proxy Manager
2. Aller dans **Proxy Hosts**
3. Trouver l'entree pour `legeai-informatique.fr` / `www.legeai-informatique.fr`
4. Modifier le **Forward Hostname** en `portfolio`
5. Modifier le **Forward Port** en `3000` (au lieu de 80)
6. Sauvegarder

### En cas de conflit git sur le VPS

```bash
cd /home/portfolio
git checkout -- .
git pull origin main
```

Puis relancer le build Docker.

### Verifier que ca tourne

```bash
# Voir les logs
docker logs portfolio --tail 30

# Verifier le status
docker ps | grep portfolio

# Tester en interne
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
```

### Structure Docker

- **Dockerfile** : multi-stage (builder + runner)
  - Stage 1 : `node:20-alpine` — `npm ci` + `npm run build`
  - Stage 2 : `node:20-alpine` — copie du standalone + static + public
- **Port expose** : 3000
- **Pas de docker-compose** — le container est lance directement avec `docker run`
- **Reseau** : `proxy` (pour que Nginx Proxy Manager puisse le voir)

### Rollback

Si le nouveau deploiement pose probleme :

```bash
docker stop portfolio && docker rm portfolio
git log --oneline -5   # trouver le commit precedent
git checkout <commit>
docker build -t portfolio . && docker run -d --name portfolio --network proxy --restart unless-stopped portfolio
```
