-- =============================================================
-- Serijski brojevi i brojevi racuna
-- Migration: 20260716000001_serial_and_invoice_numbers
--
-- Dopuna na osnovu postojece Excel evidencije korisnika:
-- svaki fizicki komad zlata ima jedinstveni serijski broj
-- proizvodjaca koji prati komad od nabavke do prodaje, i svaka
-- nabavka/prodaja ide na broj racuna. Dodaje se i PIB/adresa
-- dobavljaca (parnjak vec postojecim poljima kod customers).
-- =============================================================

ALTER TABLE lager_items
  ADD COLUMN serial_number    text,
  ADD COLUMN invoice_number   text,
  ADD COLUMN supplier_tax_id  text,
  ADD COLUMN supplier_address text;

CREATE INDEX idx_lager_items_serial_number ON lager_items(serial_number);

ALTER TABLE sales
  ADD COLUMN invoice_number text;

ALTER TABLE sale_items
  ADD COLUMN serial_number_snapshot text;
