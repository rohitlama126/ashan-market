export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      brands: {
        Row: {
          id: string;
          name: string;
          slug: string;
        };
        ComputedFields: never;
        Insert: {
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          is_active: boolean;
          name_en: string;
          name_ne: string;
          parent_id: string | null;
          slug: string;
          sort: number;
        };
        ComputedFields: never;
        Insert: {
          id?: string;
          is_active?: boolean;
          name_en: string;
          name_ne: string;
          parent_id?: string | null;
          slug: string;
          sort?: number;
        };
        Update: {
          id?: string;
          is_active?: boolean;
          name_en?: string;
          name_ne?: string;
          parent_id?: string | null;
          slug?: string;
          sort?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'categories_parent_id_fkey';
            columns: ['parent_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      inventory_levels: {
        Row: {
          location_id: string;
          on_hand: number;
          reserved: number;
          variant_id: string;
        };
        ComputedFields: never;
        Insert: {
          location_id: string;
          on_hand?: number;
          reserved?: number;
          variant_id: string;
        };
        Update: {
          location_id?: string;
          on_hand?: number;
          reserved?: number;
          variant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'inventory_levels_location_id_fkey';
            columns: ['location_id'];
            isOneToOne: false;
            referencedRelation: 'stock_locations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'inventory_levels_variant_id_fkey';
            columns: ['variant_id'];
            isOneToOne: false;
            referencedRelation: 'variant_stock';
            referencedColumns: ['variant_id'];
          },
          {
            foreignKeyName: 'inventory_levels_variant_id_fkey';
            columns: ['variant_id'];
            isOneToOne: false;
            referencedRelation: 'variants';
            referencedColumns: ['id'];
          },
        ];
      };
      product_compliance: {
        Row: {
          allergens: string[];
          country_of_origin: string;
          english_label_verified: boolean;
          fda_facility_reg_no: string | null;
          importer_of_record: string | null;
          ingredients_en: string;
          ingredients_ne: string;
          manufacturer_name: string | null;
          may_contain: string[];
          product_id: string;
          reviewed_at: string | null;
        };
        ComputedFields: never;
        Insert: {
          allergens?: string[];
          country_of_origin: string;
          english_label_verified?: boolean;
          fda_facility_reg_no?: string | null;
          importer_of_record?: string | null;
          ingredients_en?: string;
          ingredients_ne?: string;
          manufacturer_name?: string | null;
          may_contain?: string[];
          product_id: string;
          reviewed_at?: string | null;
        };
        Update: {
          allergens?: string[];
          country_of_origin?: string;
          english_label_verified?: boolean;
          fda_facility_reg_no?: string | null;
          importer_of_record?: string | null;
          ingredients_en?: string;
          ingredients_ne?: string;
          manufacturer_name?: string | null;
          may_contain?: string[];
          product_id?: string;
          reviewed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'product_compliance_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: true;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      products: {
        Row: {
          brand_id: string | null;
          category_id: string;
          created_at: string;
          description_en: string;
          description_ne: string;
          dietary: string[];
          featured_rank: number | null;
          id: string;
          name_en: string;
          name_ne: string;
          slug: string;
          spice_level: number | null;
          status: Database['public']['Enums']['product_status'];
          tags: string[];
          updated_at: string;
          vendor_id: string;
        };
        ComputedFields: never;
        Insert: {
          brand_id?: string | null;
          category_id: string;
          created_at?: string;
          description_en?: string;
          description_ne?: string;
          dietary?: string[];
          featured_rank?: number | null;
          id?: string;
          name_en: string;
          name_ne: string;
          slug: string;
          spice_level?: number | null;
          status?: Database['public']['Enums']['product_status'];
          tags?: string[];
          updated_at?: string;
          vendor_id: string;
        };
        Update: {
          brand_id?: string | null;
          category_id?: string;
          created_at?: string;
          description_en?: string;
          description_ne?: string;
          dietary?: string[];
          featured_rank?: number | null;
          id?: string;
          name_en?: string;
          name_ne?: string;
          slug?: string;
          spice_level?: number | null;
          status?: Database['public']['Enums']['product_status'];
          tags?: string[];
          updated_at?: string;
          vendor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'products_brand_id_fkey';
            columns: ['brand_id'];
            isOneToOne: false;
            referencedRelation: 'brands';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'products_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'products_vendor_id_fkey';
            columns: ['vendor_id'];
            isOneToOne: false;
            referencedRelation: 'vendors';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          full_name: string | null;
          home_zip: string | null;
          id: string;
          locale: string;
          marketing_opt_in: boolean;
          phone: string | null;
          role: Database['public']['Enums']['user_role'];
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          full_name?: string | null;
          home_zip?: string | null;
          id: string;
          locale?: string;
          marketing_opt_in?: boolean;
          phone?: string | null;
          role?: Database['public']['Enums']['user_role'];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          full_name?: string | null;
          home_zip?: string | null;
          id?: string;
          locale?: string;
          marketing_opt_in?: boolean;
          phone?: string | null;
          role?: Database['public']['Enums']['user_role'];
          updated_at?: string;
        };
        Relationships: [];
      };
      stock_locations: {
        Row: {
          id: string;
          kind: string;
          local_delivery_enabled: boolean;
          metro: string | null;
          name: string;
          pickup_enabled: boolean;
          vendor_id: string;
        };
        ComputedFields: never;
        Insert: {
          id?: string;
          kind: string;
          local_delivery_enabled?: boolean;
          metro?: string | null;
          name: string;
          pickup_enabled?: boolean;
          vendor_id: string;
        };
        Update: {
          id?: string;
          kind?: string;
          local_delivery_enabled?: boolean;
          metro?: string | null;
          name?: string;
          pickup_enabled?: boolean;
          vendor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'stock_locations_vendor_id_fkey';
            columns: ['vendor_id'];
            isOneToOne: false;
            referencedRelation: 'vendors';
            referencedColumns: ['id'];
          },
        ];
      };
      variants: {
        Row: {
          compare_at_cents: number | null;
          id: string;
          is_active: boolean;
          net_weight_g: number | null;
          price_cents: number;
          product_id: string;
          shipping_class: Database['public']['Enums']['shipping_class'];
          sku: string;
          sort: number;
          title_en: string;
          title_ne: string;
        };
        ComputedFields: never;
        Insert: {
          compare_at_cents?: number | null;
          id?: string;
          is_active?: boolean;
          net_weight_g?: number | null;
          price_cents: number;
          product_id: string;
          shipping_class?: Database['public']['Enums']['shipping_class'];
          sku: string;
          sort?: number;
          title_en: string;
          title_ne: string;
        };
        Update: {
          compare_at_cents?: number | null;
          id?: string;
          is_active?: boolean;
          net_weight_g?: number | null;
          price_cents?: number;
          product_id?: string;
          shipping_class?: Database['public']['Enums']['shipping_class'];
          sku?: string;
          sort?: number;
          title_en?: string;
          title_ne?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'variants_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      vendors: {
        Row: {
          commission_bps: number;
          created_at: string;
          id: string;
          is_house: boolean;
          name: string;
          slug: string;
          stripe_account_id: string | null;
        };
        ComputedFields: never;
        Insert: {
          commission_bps?: number;
          created_at?: string;
          id?: string;
          is_house?: boolean;
          name: string;
          slug: string;
          stripe_account_id?: string | null;
        };
        Update: {
          commission_bps?: number;
          created_at?: string;
          id?: string;
          is_house?: boolean;
          name?: string;
          slug?: string;
          stripe_account_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      variant_stock: {
        Row: {
          available: number | null;
          variant_id: string;
        };
        ComputedFields: never;
        Relationships: [];
      };
    };
    Functions: {
      delete_my_account: { Args: Record<PropertyKey, never>; Returns: undefined };
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      is_staff: { Args: Record<PropertyKey, never>; Returns: boolean };
    };
    Enums: {
      product_status: 'draft' | 'active' | 'archived';
      shipping_class: 'ambient' | 'chilled' | 'frozen';
      user_role: 'customer' | 'staff' | 'admin';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      product_status: ['draft', 'active', 'archived'],
      shipping_class: ['ambient', 'chilled', 'frozen'],
      user_role: ['customer', 'staff', 'admin'],
    },
  },
} as const;
