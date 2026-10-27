// Database types for the public schema. Regenerate after every migration with `pnpm db:types`
// (needs the local stack running). Hand-written until the first generation; keep the shape identical
// to `supabase gen types` output.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
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
    };
    Views: { [_ in never]: never };
    Functions: {
      delete_my_account: { Args: never; Returns: undefined };
      is_admin: { Args: never; Returns: boolean };
      is_staff: { Args: never; Returns: boolean };
    };
    Enums: {
      user_role: 'customer' | 'staff' | 'admin';
    };
    CompositeTypes: { [_ in never]: never };
  };
};
