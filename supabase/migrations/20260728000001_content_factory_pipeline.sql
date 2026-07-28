-- =============================================================
-- Multi-Agent Content Factory v2.0 - tabele za generisanje blog sadrzaja
-- preko LangGraph pipeline-a (odvojen repo: marketing-agent-orchestrator).
--
-- Namerno NE dira postojecu 'sites' tabelu - sve novo je referencira
-- preko FK-a ('client_id' = 'sites.key', npr. 'goldinvest', 'zlatneplocice').
--
-- NAPOMENA: Ova migracija dokumentuje semu koja je vec bila primenjena
-- direktno na produkcionu bazu (preko Supabase MCP-a, 2026-07-27/28) dok
-- git repo nije bio azuriran - ovaj fajl to sada ispravlja da bude
-- verzionisano kao i sve ostalo.
-- Migration: 20260728000001_content_factory_pipeline
-- =============================================================

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- -----------------------------------------------------------
-- content_pipeline_settings - 1:1 "extension" tabela za 'sites', drzi
-- iskljucivo polja specificna za content pipeline (Sanity kredencijali,
-- brand voice). Ne dira 'sites' semu.
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS content_pipeline_settings (
  site_id               smallint PRIMARY KEY REFERENCES sites (id),
  sanity_project_id     text,
  sanity_dataset        text NOT NULL DEFAULT 'production',
  sanity_token          text,
  sanity_document_type  text NOT NULL DEFAULT 'post',
  brand_voice           text NOT NULL,
  created_at            timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE content_pipeline_settings ENABLE ROW LEVEL SECURITY;

INSERT INTO content_pipeline_settings (site_id, sanity_project_id, sanity_dataset, sanity_document_type, brand_voice)
VALUES
  (
    1,
    '67ilzq9k',
    'production',
    'post',
    'Premium, autoritativan i visoko profesionalan ton. Ciljna publika su imucni investitori (high-net-worth) koji vec razumeju osnove finansija - fokus na edukaciju, dubinsku analizu i kredibilitet. Ne pojednostavljuj prekomerno i ne budi previse casual.'
  ),
  (
    2,
    '67ilzq9k',
    'zlatneplocice',
    'post',
    'Direktan, pristupacan i izuzetno pouzdan ton. Ciljna publika su obicni gradjani koji zele da zastite svoju ustedjevinu - fokus na sigurnost, jasno objasnjavanje bez zargona i izgradnju poverenja.'
  )
ON CONFLICT (site_id) DO NOTHING;

-- -----------------------------------------------------------
-- blogs_queue - operativni red cekanja poslova (run_factory.py / Telegram bot)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS blogs_queue (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id      text NOT NULL REFERENCES sites (key),
  topic          text NOT NULL,
  status         text NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'processing', 'completed', 'error')),
  error_message  text,
  slug           text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS blogs_queue_status_created_at_idx
  ON blogs_queue (status, created_at);

ALTER TABLE blogs_queue ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------
-- published_content - trajna istorija objavljenog sadrzaja sa embedding
-- vektorima, koristi je History Guard agent za anti-kanibalizacionu proveru.
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS published_content (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   text NOT NULL REFERENCES sites (key),
  title       text NOT NULL,
  slug        text NOT NULL,
  topic       text NOT NULL,
  embedding   extensions.vector(1536),  -- 1536 dimenzija = OpenAI text-embedding-3-small
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS published_content_embedding_idx
  ON published_content
  USING hnsw (embedding extensions.vector_cosine_ops);

ALTER TABLE published_content ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------
-- match_documents - RPC za pronalazenje najslicnijeg vec objavljenog
-- clanka (kosinusna slicnost = 1 - kosinusna distanca). Filtrira po
-- klijentu, jer sadrzaj jednog brenda ne sme da se poredi sa sadrzajem
-- drugog. 'search_path' je namerno FIKSIRAN (ne prazan - prazan bi
-- pokvario resoluciju '<=>' operatora koji zivi u 'extensions' semi).
-- -----------------------------------------------------------
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding    extensions.vector(1536),
  match_threshold    float,
  match_client_id    text DEFAULT NULL
)
RETURNS TABLE (
  id          uuid,
  title       text,
  slug        text,
  similarity  float
)
LANGUAGE sql STABLE
SET search_path = public, extensions
AS $$
  SELECT
    published_content.id,
    published_content.title,
    published_content.slug,
    1 - (published_content.embedding <=> query_embedding) AS similarity
  FROM published_content
  WHERE 1 - (published_content.embedding <=> query_embedding) > match_threshold
    AND (match_client_id IS NULL OR published_content.client_id = match_client_id)
  ORDER BY published_content.embedding <=> query_embedding ASC
  LIMIT 1;
$$;
