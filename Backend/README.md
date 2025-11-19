# Backend — Instructions de démarrage et déploiement

Ce fichier contient les étapes pour démarrer le backend localement, gérer la base de données PostgreSQL et configurer le déploiement sur Render.

## Variables d'environnement requises
- `DATABASE_URL` — Connection string Postgres (ex: `postgres://user:pass@host:5432/dbname`).
- `JWT_SECRET` — Secret pour signer les tokens JWT.
- (optionnel) `PORT` — Port sur lequel l'app écoute (par défaut 5000).
- Mailer / notifications:
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`
- `NODE_ENV` — production / development

Ne mettez jamais de secrets en clair dans le dépôt public. Utilisez les variables d'environnement de Render pour la production.

## Démarrer localement (Postgres system)
1. Installer Postgres (Ubuntu/Debian) :
```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
```
2. Démarrer le service et créer l'utilisateur & la base (exemple) :
```bash
sudo systemctl enable --now postgresql
sudo -u postgres psql -c "CREATE ROLE amadou LOGIN PASSWORD 'YOUR_PASSWORD' CREATEDB;"
sudo -u postgres psql -c "CREATE DATABASE guilla_tech_v2 OWNER amadou;"
```
3. Dans `Backend/.env` (ou via votre shell), définissez `DATABASE_URL` :
```
DATABASE_URL="postgres://amadou:YOUR_PASSWORD@localhost:5432/guilla_tech_v2"
```
4. Lancer l'application (dev) :
```bash
cd Backend
npm install
npm run dev
```

## Démarrer localement avec Docker (option recommandée pour isolation)
Créer `docker-compose.yml` (exemple) :
```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: amadou
      POSTGRES_PASSWORD: 66396816
      POSTGRES_DB: guilla_tech_v2
    ports:
      - '5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```
Puis :
```bash
cd Backend
docker compose up -d
npm install
npm run dev
```

## Prisma & Migrations
- Le dossier `prisma/migrations` contient les migrations Postgres — ces fichiers sont commités et seront appliqués en prod.
- Localement pour créer une migration :
```bash
# après modification du schema.prisma
npx prisma migrate dev --name <description>
```
- En production (Render) : la commande de démarrage doit appliquer les migrations avant de lancer l'app. Exemple de Start Command pour Render :
```
npx prisma migrate deploy && npm run start
```

## Déployer sur Render
1. Dans Render, créez une Managed Postgres Database (si nécessaire).
2. Dans le dashboard Render, créez un Web Service et connectez votre repo GitHub.
   - Branch: `main`
   - Build command: `npm ci`
   - Start command: `npx prisma migrate deploy && npm run start`
3. Dans les Environment Variables du service Render, ajoutez:
   - `DATABASE_URL` = (connection string fournie par Render)
   - `JWT_SECRET` = (votre secret)
   - autres variables SMTP si nécessaire
4. Déployez et consultez les logs Render pour vérifier que `prisma migrate deploy` et la connexion DB passent correctement.

## Endpoints utiles
- `/api/health` — endpoint santé
- `/api/test-db` — test de connexion à la DB
- `/api/system-info` — info système

## Sécurité et bonnes pratiques
- Ne committez jamais de secrets. Si vous avez committé des secrets par erreur, révoquez-les et forcez la rotation.
- Gardez vos migrations sous contrôle de version (déjà en place).

---

Si vous voulez, je peux :
- (A) vous guider pas à pas dans l'interface Render pour coller les variables et la Start Command,
- (B) vérifier le premier déploiement / logs après que vous ayez configuré Render.

Dites-moi quelle option vous préférez.
