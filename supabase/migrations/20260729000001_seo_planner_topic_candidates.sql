-- =============================================================
-- SEO Planer Agent — tabela za kandidate tema (odvojen repo:
-- marketing-agent-orchestrator).
--
-- Namerno NE dira postojece tabele osim dodavanjem jedne nove kolone
-- na 'content_pipeline_settings' (seed kljucne reci po klijentu, isti
-- obrazac kao vec postojece 'brand_voice' polje).
--
-- NAPOMENA: Ova migracija dokumentuje semu koja je vec bila primenjena
-- direktno na produkcionu bazu (preko Supabase MCP-a, 2026-07-29) dok
-- git repo nije bio azuriran - ovaj fajl to sada ispravlja da bude
-- verzionisano kao i sve ostalo (isti obrazac kao
-- 20260728000001_content_factory_pipeline.sql).
-- Migration: 20260729000001_seo_planner_topic_candidates
-- =============================================================

-- -----------------------------------------------------------
-- topic_candidates - kandidati tema koje predlaze SEO Planer agent
-- (izvor: DataForSEO keyword expansion + Google Search Console
-- "low-hanging fruit" upiti). Ubedljivi kandidati se automatski
-- prebacuju u 'blogs_queue' (status='queued'), granicni cekaju
-- ljudsko odobrenje preko Telegram '/plan' i '/approve' komandi
-- (status='suggested').
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS topic_candidates (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id           text NOT NULL REFERENCES sites (key),
  keyword             text NOT NULL,
  source              text NOT NULL CHECK (source IN ('dataforseo', 'gsc')),
  search_volume       integer,
  keyword_difficulty  numeric,
  gsc_position        numeric,
  gsc_impressions     integer,
  status              text NOT NULL DEFAULT 'suggested'
                         CHECK (status IN ('suggested', 'queued', 'rejected')),
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS topic_candidates_client_status_idx
  ON topic_candidates (client_id, status, created_at DESC);

ALTER TABLE topic_candidates ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------
-- content_pipeline_settings.seo_seed_keywords - seed kljucne reci po
-- klijentu koje SEO Planer prosiruje preko DataForSEO API-ja. Isti
-- obrazac kao postojece 'brand_voice' polje na istoj tabeli.
-- -----------------------------------------------------------
ALTER TABLE content_pipeline_settings
  ADD COLUMN IF NOT EXISTS seo_seed_keywords text[] NOT NULL DEFAULT '{}';

UPDATE content_pipeline_settings SET seo_seed_keywords =
  ARRAY['investiciono zlato', 'ulaganje u zlato', 'cena zlata']
  WHERE site_id = 1;

UPDATE content_pipeline_settings SET seo_seed_keywords =
  ARRAY['zlatna poluga', 'otkup zlata', 'investiciono srebro']
  WHERE site_id = 2;
