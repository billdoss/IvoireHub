# Pharmacies de garde — scraping quotidien pagesjaunes.ci

## Principe
- Une **GitHub Action** (`.github/workflows/scrape-pharmacies.yml`) tourne **chaque jour à 05h30 UTC**
  et lance `node scripts/scrape-pharmacies.mjs` (zéro dépendance, Node 20+).
- Le script parcourt `https://pagesjaunes.ci/pharmacies-de-garde/` + les 13 pages
  par commune (`/pharmacies-de-garde-cocody/`, `-plateau`, …), extrait
  **nom / adresse / téléphone / période de garde** (ex. samedi → vendredi),
  puis **upsert** dans `public.pharmacies_garde` via l'API REST Supabase.
- Les gardes expirées (`end_date < période en cours`) sont marquées `is_active = false`.
- La page `/pharmacies` lit la base pour la date choisie, affiche la **carte Leaflet**,
  et propose la **recherche de la pharmacie la plus proche** (géolocalisation navigateur
  + distance haversine ; repli sur le centre de la commune si pas de GPS).

## Installation (à faire une fois)

1. **Créer les tables (nouveau projet vide)** dans Supabase Dashboard
   (https://supabase.com/dashboard/project/rsihxqkjexxhycrcibwd) > SQL Editor :
   - collez d'abord tout le fichier `supabase/migrations/20260115133322_2e5e1018-c259-4b8b-8db8-9760eb5186c6.sql` > **Run**
     (crée les 12 tables : profiles, cities, communes, businesses, pharmacies_garde…).
   - puis collez `supabase/migrations/20261016000000_pharmacies_garde_scraping.sql` > **Run**
     (ajoute `source`, `source_url`, `commune_name`, `city_name`, `scraped_at`,
     `is_active` + contrainte unique `name + start_date + end_date` pour l'upsert).

2. **Configurer les secrets GitHub** (repo > Settings > Secrets and variables > Actions) :
   - `SUPABASE_URL` = `https://rsihxqkjexxhycrcibwd.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = clé **service_role** (Dashboard > Project Settings > API —
     ⚠️ jamais la clé anon, jamais dans le code).

3. **Tester** : onglet Actions > "Scraping quotidien — Pharmacies de garde" >
   Run workflow. Le JSON du jour est conservé en artifact (30 jours).

## Lancer en local
```bash
set SUPABASE_URL=https://rsihxqkjexxhycrcibwd.supabase.co
set SUPABASE_SERVICE_ROLE_KEY=... (service_role)
node scripts/scrape-pharmacies.mjs
```
Sans clés : mode dry-run, écrit `pharmacies-garde.json` sans toucher la base.
