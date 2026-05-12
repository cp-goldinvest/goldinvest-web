-- =============================================================
-- Zlatne Plocice - E-commerce tabele (orders, order_items) +
-- rezervacija lager_items za pending porudzbine
-- Migration: 20260512000003_create_orders_and_lager_reservation
--
-- Scope (MVP):
--   - orders: porudzbine sa guest kupcima (bez customers tabele)
--   - order_items: stavke porudzbine sa cenovnim/lager snapshot-om
--   - lager_items.reserved_order_id: rezervacija fizickog komada
--     dok ne stigne uplata
--   - bez carts/cart_items (korpa zivi u brauzeru, localStorage)
--   - bez price_quotes (cena se fiksira na trenutku porudzbine)
--   - bez payments (samo bank_transfer, audit kasnije ako zatreba)
--
-- RLS: nikakav public pristup. Sve preko service_role iz API-ja
-- (POST /api/zp/checkout u zlatneplocice repo-u). Admin pun pristup.
--
-- Stock flow:
--   1. POST /checkout -> kreira order (status='pending_payment'),
--      kreira order_items, postavlja lager_items.reserved_order_id
--   2. Admin potvrdi uplatu -> status='paid', DELETE rezervisanih
--      lager_items (FK na order_items.lager_item_id ce postati NULL)
--   3. Admin posalje -> status='shipped' + tracking number
--   4. Cancel pre paid: status='cancelled', UPDATE reserved_order_id=NULL
--   5. Cancel posle paid: admin rucno re-INSERT u lager_items ako treba
-- =============================================================

-- -----------------------------------------------------------
-- ORDERS - jedna porudzbina po redu
-- -----------------------------------------------------------
CREATE TABLE orders (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number              bigserial UNIQUE NOT NULL,
  site_id                   smallint NOT NULL REFERENCES sites(id) ON DELETE RESTRICT,

  status                    text NOT NULL DEFAULT 'pending_payment'
                            CHECK (status IN ('pending_payment','paid','shipped','delivered','cancelled')),

  -- Guest kupac (nema customers tabele, sve direktno na orderu)
  customer_name             text NOT NULL,
  customer_email            text NOT NULL,
  customer_phone            text NOT NULL,

  -- Adresa dostave (odvojene kolone radi laksih query-ja i fakture)
  shipping_address_line     text NOT NULL,
  shipping_city             text NOT NULL,
  shipping_postal_code      text,
  shipping_country          text NOT NULL DEFAULT 'Srbija',
  customer_note             text,

  -- Iznosi u RSD
  subtotal_rsd              numeric(12,2) NOT NULL CHECK (subtotal_rsd >= 0),
  shipping_rsd              numeric(12,2) NOT NULL DEFAULT 0 CHECK (shipping_rsd >= 0),
  total_rsd                 numeric(12,2) NOT NULL CHECK (total_rsd >= 0),

  -- Placanje
  payment_method            text NOT NULL DEFAULT 'bank_transfer'
                            CHECK (payment_method IN ('bank_transfer','cash_on_delivery','online_card')),
  payment_reference         text,

  -- Otprema
  shipping_carrier          text,
  shipping_tracking_number  text,

  -- Spot snapshot u trenutku porudzbine (za revizije i P&L)
  gold_snapshot_id          uuid REFERENCES gold_price_snapshots(id) ON DELETE SET NULL,

  -- Status timestamps
  created_at                timestamptz NOT NULL DEFAULT now(),
  paid_at                   timestamptz,
  shipped_at                timestamptz,
  delivered_at              timestamptz,
  cancelled_at              timestamptz,
  cancelled_reason          text
);

-- order_number krece od 1000 (izgled "ozbiljnije" prve porudzbine)
ALTER SEQUENCE orders_order_number_seq RESTART WITH 1000;

CREATE INDEX idx_orders_site            ON orders(site_id);
CREATE INDEX idx_orders_status          ON orders(status);
CREATE INDEX idx_orders_email           ON orders(customer_email);
CREATE INDEX idx_orders_created         ON orders(created_at DESC);
CREATE INDEX idx_orders_pending_old     ON orders(created_at) WHERE status = 'pending_payment';

-- -----------------------------------------------------------
-- ORDER_ITEMS - stavke porudzbine sa imutabilnim snapshot-ima
-- -----------------------------------------------------------
CREATE TABLE order_items (
  id                              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id                        uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

  -- Reference (mogu postati NULL ako se izvor obrise)
  variant_id                      uuid REFERENCES product_variants(id) ON DELETE SET NULL,
  lager_item_id                   uuid REFERENCES lager_items(id) ON DELETE SET NULL,

  -- Snapshot proizvoda (preziva izmene/brisanja u products tabelama)
  product_name_snapshot           text NOT NULL,
  variant_name_snapshot           text,
  weight_g_snapshot               numeric(10,4) NOT NULL,
  category_snapshot               text NOT NULL,

  -- Kolicina i cena (sve imutabilno posle kreiranja)
  quantity                        integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_rsd                  numeric(12,2) NOT NULL CHECK (unit_price_rsd >= 0),
  line_total_rsd                  numeric(12,2) NOT NULL CHECK (line_total_rsd >= 0),

  -- Nabavna cena snapshot (za P&L; preuzeta iz lager_items u trenutku porudzbine)
  purchase_price_snapshot_rsd     numeric(12,2),

  created_at                      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_items_order      ON order_items(order_id);
CREATE INDEX idx_order_items_variant    ON order_items(variant_id);
CREATE INDEX idx_order_items_lager      ON order_items(lager_item_id);

-- -----------------------------------------------------------
-- LAGER_ITEMS - dodaj rezervaciju za pending porudzbine
-- -----------------------------------------------------------
ALTER TABLE lager_items
  ADD COLUMN reserved_order_id uuid REFERENCES orders(id) ON DELETE SET NULL;

-- Partial index - samo rezervisani redovi (vecina je NULL)
CREATE INDEX idx_lager_items_reserved
  ON lager_items(reserved_order_id)
  WHERE reserved_order_id IS NOT NULL;

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- BEZ public politika. Sve insert/update/select ide preko service_role
-- iz API rute (zlatneplocice /api/checkout, goldinvest /admin/porudzbine).
-- Service role bypass-uje RLS po definiciji.

-- Admin pun pristup.
CREATE POLICY "admin_all_orders"
  ON orders FOR ALL
  USING      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin_all_order_items"
  ON order_items FOR ALL
  USING      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
