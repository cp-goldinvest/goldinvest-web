export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          category: "poluga" | "plocica" | "dukat" | "multipack";
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
          site_id: number;
          name: string;
          category: string | null;
          weight_g: number | null;
          brand: string | null;
          margin_stock_pct: number;
          margin_advance_pct: number;
          margin_purchase_pct: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["pricing_tiers"]["Row"], "id" | "created_at" | "site_id"> & {
          site_id?: number;
        };
        Update: Partial<Database["public"]["Tables"]["pricing_tiers"]["Insert"]>;
      };
      pricing_rules: {
        Row: {
          id: string;
          variant_id: string;
          site_id: number;
          override_stock_price: number | null;
          override_advance_price: number | null;
          override_purchase_price: number | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["pricing_rules"]["Row"], "id" | "updated_at" | "site_id"> & {
          site_id?: number;
        };
        Update: Partial<Database["public"]["Tables"]["pricing_rules"]["Insert"]>;
      };
      gold_price_snapshots: {
        Row: {
          id: string;
          xau_usd: number | null;         // nullable - EUR-only snapshots (manual_rates) omit USD
          xau_eur: number | null;
          usd_rsd: number | null;         // nullable - EUR-only snapshots omit USD/RSD
          eur_rsd: number | null;
          price_per_g_rsd: number | null; // computed: prefers xau_eur×eur_rsd, falls back to xau_usd×usd_rsd
          source: string;                 // 'auto' | 'manual_rates'
          eur_rsd_source: "manual" | "api" | "fallback" | null; // how EUR/RSD was resolved
          fetched_at: string;
        };
        // Explicit Insert - price_per_g_rsd is generated (never inserted).
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
          site_id: number;
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
        Insert: Omit<Database["public"]["Tables"]["purchase_inquiries"]["Row"], "id" | "created_at" | "site_id"> & {
          site_id?: number;
        };
        Update: Partial<Database["public"]["Tables"]["purchase_inquiries"]["Insert"]>;
      };
      sites: {
        Row: {
          id: number;
          key: string;
          name: string;
          domain: string;
          base_url: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id: number;
          key: string;
          name: string;
          domain: string;
          base_url: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sites"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          order_number: number;
          site_id: number;
          status: "pending_payment" | "paid" | "shipped" | "delivered" | "cancelled";
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          shipping_address_line: string;
          shipping_city: string;
          shipping_postal_code: string | null;
          shipping_country: string;
          customer_note: string | null;
          subtotal_rsd: number;
          shipping_rsd: number;
          total_rsd: number;
          payment_method: "bank_transfer" | "cash_on_delivery" | "online_card";
          payment_reference: string | null;
          shipping_carrier: string | null;
          shipping_tracking_number: string | null;
          gold_snapshot_id: string | null;
          created_at: string;
          paid_at: string | null;
          shipped_at: string | null;
          delivered_at: string | null;
          cancelled_at: string | null;
          cancelled_reason: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["orders"]["Row"],
          "id" | "order_number" | "created_at"
        > & {
          id?: string;
          order_number?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          variant_id: string | null;
          lager_item_id: string | null;
          product_name_snapshot: string;
          variant_name_snapshot: string | null;
          weight_g_snapshot: number;
          category_snapshot: string;
          quantity: number;
          unit_price_rsd: number;
          line_total_rsd: number;
          purchase_price_snapshot_rsd: number | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["order_items"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
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
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          source: string | null;
          is_active: boolean;
          unsubscribed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          source?: string | null;
          is_active?: boolean;
          unsubscribed_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["newsletter_subscribers"]["Insert"]>;
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string | null;
          message: string;
          status: "new" | "read" | "replied" | "archived";
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          subject?: string | null;
          message: string;
          status?: "new" | "read" | "replied" | "archived";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["contact_messages"]["Insert"]>;
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
export type NewsletterSubscriber = Database["public"]["Tables"]["newsletter_subscribers"]["Row"];
export type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];
export type Site = Database["public"]["Tables"]["sites"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];

// Composite type used across product pages.
// pricing_rules is an array because the (variant_id, site_id) UNIQUE constraint
// makes the embed many-per-variant. Always filter to single site at query time
// (.eq("pricing_rules.site_id", GOLDINVEST_SITE_ID)) and access via pickPricingRule().
export type VariantWithPricing = ProductVariant & {
  pricing_rules: PricingRule[] | PricingRule | null;
  computed_prices: {
    stock: number;
    advance: number;
    purchase: number;
  };
};
