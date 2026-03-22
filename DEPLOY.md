# Déploiement — Le Geai Informatique

## Infra

- **Hébergeur** : OVH VPS
- **Chemin sur le VPS** : `/home/portfolio`
- **Repo Git** : `https://github.com/remigeapre/portfolio` (branche `main`)
- **Stack** : Nginx Alpine (Docker) + Nginx Proxy Manager devant (réseau `proxy`)
- **Container** : `portfolio` (image `portfolio`)
- **Type de site** : HTML/CSS/SVG statique (pas de build)

## Déployer une mise à jour

Depuis le VPS (SSH) :

```bash
cd /home/portfolio && git pull origin main && docker build -t portfolio . && docker stop portfolio && docker rm portfolio && docker run -d --name portfolio --network proxy --restart unless-stopped portfolio
```

### Ce que ça fait

1. Pull les derniers changements depuis GitHub
2. Rebuild l'image Nginx avec les nouveaux fichiers
3. Arrête et supprime l'ancien container
4. Relance le container sur le réseau `proxy`

Coupure de quelques secondes pendant le rebuild.

## Configuration

### Dockerfile

Minimaliste — ne pas ajouter de nginx.conf custom (le Nginx Proxy Manager gère le SSL et le routage) :

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
```

### Réseau Docker

Le container doit être sur le réseau `proxy` pour que Nginx Proxy Manager puisse le voir :

```bash
docker run -d --name portfolio --network proxy --restart unless-stopped portfolio
```

**NE PAS utiliser docker-compose** pour ce site — l'ancien setup fonctionne avec `docker run` directement.

### En cas de conflit git

```bash
mv <fichier_en_conflit> <fichier_en_conflit>.bak
git pull origin main
```

## Notes

- Le Dockerfile.bak sur le VPS peut être supprimé : `rm /home/portfolio/Dockerfile.bak`
- Le fichier logo s'appelle `logo.svg` (minuscule) — Linux est case-sensitive
- Les fichiers docker-compose.yml et nginx.conf dans le repo ne sont PAS utilisés en prod
