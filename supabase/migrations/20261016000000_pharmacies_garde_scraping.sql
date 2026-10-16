-- Enrichissement pharmacies_garde pour le scraping quotidien pagesjaunes.ci
-- A appliquer via Supabase Dashboard > SQL Editor

-- 1) Colonnes source + traçabilité
ALTER TABLE public.pharmacies_garde
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'pagesjaunes.ci',
  ADD COLUMN IF NOT EXISTS source_url TEXT,
  ADD COLUMN IF NOT EXISTS commune_name TEXT,
  ADD COLUMN IF NOT EXISTS city_name TEXT DEFAULT 'Abidjan',
  ADD COLUMN IF NOT EXISTS scraped_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 2) Contrainte d'unicité pour l'upsert (même pharmacie, même période)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'pharmacies_garde_unique_period'
  ) THEN
    ALTER TABLE public.pharmacies_garde
      ADD CONSTRAINT pharmacies_garde_unique_period UNIQUE (name, start_date, end_date);
  END IF;
END $$;

-- 3) Index pour la recherche de proximité / filtres
CREATE INDEX IF NOT EXISTS idx_pharmacies_garde_dates
  ON public.pharmacies_garde (start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_pharmacies_garde_commune
  ON public.pharmacies_garde (commune_name);
CREATE INDEX IF NOT EXISTS idx_pharmacies_garde_active
  ON public.pharmacies_garde (is_active);
CREATE INDEX IF NOT EXISTS idx_pharmacies_garde_coords
  ON public.pharmacies_garde (latitude, longitude);
