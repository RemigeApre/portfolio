# Déploiement — Le Geai Informatique

## Infra

- **Hébergeur** : OVH VPS
- **Chemin sur le VPS** : `/home/portfolio`
- **Repo Git** : `https://github.com/remigeapre/portfolio` (branche `main`)
- **Stack** : Nginx + Docker
- **Container** : `portfolio` (image `portfolio`)
- **Type de site** : HTML/CSS/SVG statique (pas de build)

## Déployer une mise à jour

Depuis le VPS (SSH) :

```bash
cd /home/portfolio
git pull origin main
docker stop portfolio && docker rm portfolio
docker compose up -d --build
```

### Ce que ça fait

1. Pull les derniers changements depuis GitHub
2. Arrête et supprime l'ancien container
3. Rebuild l'image Nginx avec les nouveaux fichiers et relance

Coupure de quelques secondes pendant le rebuild.

### En cas de conflit git

Si le pull échoue à cause de fichiers non trackés :

```bash
mv <fichier_en_conflit> <fichier_en_conflit>.bak
git pull origin main
```

## Structure Docker

- **Dockerfile** : Nginx Alpine, copie les fichiers statiques, exclut les fichiers dev (docx, Dockerfile, etc.)
- **nginx.conf** : gzip activé, cache 30j assets / 1h HTML, headers de sécurité, page 404 custom
- **docker-compose.yml** : container `legeai-informatique`, restart auto, port 8080:80

## Notes

- Le port 8080 est exposé par le container. Si un reverse proxy est devant (Nginx Proxy Manager), il pointe vers ce port.
- Si pas de reverse proxy, changer `"8080:80"` en `"80:80"` dans `docker-compose.yml`.
- Le Dockerfile.bak sur le VPS est l'ancien Dockerfile, peut être supprimé une fois le nouveau validé : `rm /home/portfolio/Dockerfile.bak`
