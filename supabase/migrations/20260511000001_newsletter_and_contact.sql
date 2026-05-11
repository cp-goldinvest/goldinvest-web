-- =============================================================
-- GoldInvest — Newsletter subscribers & Contact messages
-- Migration: 20260511000001_newsletter_and_contact
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- NEWSLETTER SUBSCRIBERS
-- Email opt-in collected via NewsletterSection on /blog and similar.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE newsletter_subscribers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email           text UNIQUE NOT NULL,
  source          text DEFAULT 'blog',     -- 'blog', 'footer', 'product', ...
  is_active       boolean NOT NULL DEFAULT true,
  unsubscribed_at timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_newsletter_email     ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_active    ON newsletter_subscribers(is_active) WHERE is_active = true;

-- ─────────────────────────────────────────────────────────────
-- CONTACT MESSAGES
-- Submissions from the /kontakt form.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE contact_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  email       text NOT NULL,
  phone       text,
  subject     text,
  message     text NOT NULL,
  status      text NOT NULL DEFAULT 'new'
              CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_contact_status     ON contact_messages(status);
CREATE INDEX idx_contact_created_at ON contact_messages(created_at DESC);

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages       ENABLE ROW LEVEL SECURITY;

-- Public can subscribe (insert), but cannot read other subscribers.
CREATE POLICY "public_insert_newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- Public can send a contact message, but cannot read others.
CREATE POLICY "public_insert_contact"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- Admin full access.
CREATE POLICY "admin_all_newsletter"
  ON newsletter_subscribers FOR ALL
  USING      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin_all_contact"
  ON contact_messages FOR ALL
  USING      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
