# Deploiement - Le Geai Informatique

## Infra

- **Hebergeur** : OVH VPS
- **Chemin sur le VPS** : `/home/portfolio`
- **Repo Git** : `https://github.com/remigeapre/portfolio` (branche `main`)
- **Stack** : Next.js + Docker + Nginx Proxy Manager (reseau `proxy`)
- **Container** : `portfolio` (image `portfolio`)

## Deployer une mise a jour

```bash
cd /home/portfolio && git pull origin main && docker build -t portfolio . && docker stop portfolio && docker rm portfolio && docker run -d --name portfolio --network proxy --restart unless-stopped portfolio
```

## Notes

- Le container expose le port 3000 en interne
- Nginx Proxy Manager doit pointer vers `portfolio:3000`
- Ancien setup: nginx:alpine servait du HTML statique sur le port 80
- Nouveau setup: Next.js standalone sur le port 3000
- **IMPORTANT**: Mettre a jour le proxy host dans Nginx Proxy Manager pour pointer vers le port 3000
