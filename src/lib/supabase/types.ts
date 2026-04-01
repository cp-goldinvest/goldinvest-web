export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          category: "poluga" | "plocica" | "dukat" | "novac";
          brand: string;
          refinery: string | null;
          origin: string | null;
          description: string | null;
          properties: string | null;
          payment_info: string | null;
          declaration: string | null;
          tax_info: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          slug: string;
          weight_g: number;
          weight_oz: number;        // computed
          purity: number;
          fine_weight_g: number;    // computed
          name: string | null;
          sku: string | null;
          stock_qty: number;
          availability: "in_stock" | "available_on_request" | "preorder";
          lead_time_weeks: number | null;
          images: string[];
          sort_order: number;
          is_active: boolean;
        };
        Insert: Omit<
          Database["public"]["Tables"]["product_variants"]["Row"],
          "id" | "weight_oz" | "fine_weight_g"
        >;
        Update: Partial<Database["public"]["Tables"]["product_variants"]["Insert"]>;
      };
      pricing_tiers: {
        Row: {
          id: string;
          name: string;
          category: string | null;
          weight_g: number | null;
          brand: string | null;
          margin_stock_pct: number;
          margin_advance_pct: number;
          margin_purchase_pct: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["pricing_tiers"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["pricing_tiers"]["Insert"]>;
      };
      pricing_rules: {
        Row: {
          id: string;
          variant_id: string;
          override_stock_price: number | null;
          override_advance_price: number | null;
          override_purchase_price: number | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["pricing_rules"]["Row"], "id" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["pricing_rules"]["Insert"]>;
      };
      gold_price_snapshots: {
        Row: {
          id: string;
          xau_usd: number | null;         // nullable — EUR-only snapshots (manual_rates) omit USD
          xau_eur: number | null;
          usd_rsd: number | null;         // nullable — EUR-only snapshots omit USD/RSD
          eur_rsd: number | null;
          price_per_g_rsd: number | null; // computed: prefers xau_eur×eur_rsd, falls back to xau_usd×usd_rsd
          source: string;                 // 'auto' | 'manual_rates'
          eur_rsd_source: "manual" | "api" | "fallback" | null; // how EUR/RSD was resolved
          fetched_at: string;
        };
        // Explicit Insert — price_per_g_rsd is generated (never inserted).
        // xau_usd/usd_rsd are optional to support EUR-only admin rate snapshots.
        Insert: {
          id?: string;
          xau_usd?: number | null;
          xau_eur?: number | null;
          usd_rsd?: number | null;
          eur_rsd?: number | null;
          source?: string;
          eur_rsd_source?: "manual" | "api" | "fallback" | null;
          fetched_at?: string;
        };
        Update: {
          xau_usd?: number | null;
          xau_eur?: number | null;
          usd_rsd?: number | null;
          eur_rsd?: number | null;
          source?: string;
          eur_rsd_source?: "manual" | "api" | "fallback" | null;
          fetched_at?: string;
        };
      };
      purchase_inquiries: {
        Row: {
          id: string;
          variant_id: string | null;
          product_name: string;
          weight_g: number | null;
          price_at_time: number | null;
          client_name: string;
          client_phone: string;
          client_email: string | null;
          quantity: number;
          note: string | null;
          status: "new" | "contacted" | "sold" | "cancelled";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["purchase_inquiries"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["purchase_inquiries"]["Insert"]>;
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["admin_users"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["admin_users"]["Insert"]>;
      };
    };
  };
};

// Convenience type aliases
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductVariant = Database["public"]["Tables"]["product_variants"]["Row"];
export type PricingTier = Database["public"]["Tables"]["pricing_tiers"]["Row"];
export type PricingRule = Database["public"]["Tables"]["pricing_rules"]["Row"];
export type GoldPriceSnapshot = Database["public"]["Tables"]["gold_price_snapshots"]["Row"];
export type PurchaseInquiry = Database["public"]["Tables"]["purchase_inquiries"]["Row"];
export type AdminUser = Database["public"]["Tables"]["admin_users"]["Row"];

// Composite type used across product pages
export type VariantWithPricing = ProductVariant & {
  pricing_rules: PricingRule | null;
  computed_prices: {
    stock: number;
    advance: number;
    purchase: number;
  };
};
