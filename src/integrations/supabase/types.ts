export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          is_published: boolean | null
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_hours: {
        Row: {
          business_id: string
          close_time: string | null
          day_of_week: number
          id: string
          is_closed: boolean | null
          open_time: string | null
        }
        Insert: {
          business_id: string
          close_time?: string | null
          day_of_week: number
          id?: string
          is_closed?: boolean | null
          open_time?: string | null
        }
        Update: {
          business_id?: string
          close_time?: string | null
          day_of_week?: number
          id?: string
          is_closed?: boolean | null
          open_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_hours_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_images: {
        Row: {
          business_id: string
          caption: string | null
          created_at: string
          id: string
          image_url: string
          sort_order: number | null
        }
        Insert: {
          business_id: string
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          sort_order?: number | null
        }
        Update: {
          business_id?: string
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "business_images_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_services: {
        Row: {
          business_id: string
          id: string
          service_name: string
        }
        Insert: {
          business_id: string
          id?: string
          service_name: string
        }
        Update: {
          business_id?: string
          id?: string
          service_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_services_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          address: string | null
          category_id: string | null
          city_id: string | null
          commune_id: string | null
          created_at: string
          description_long: string | null
          description_short: string | null
          email: string | null
          facebook_url: string | null
          id: string
          instagram_url: string | null
          is_featured: boolean | null
          is_premium: boolean | null
          is_verified: boolean | null
          landmark: string | null
          latitude: number | null
          linkedin_url: string | null
          logo_url: string | null
          longitude: number | null
          name: string
          phone: string | null
          phone_secondary: string | null
          slug: string
          status: Database["public"]["Enums"]["business_status"] | null
          twitter_url: string | null
          updated_at: string
          user_id: string
          views_count: number | null
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          category_id?: string | null
          city_id?: string | null
          commune_id?: string | null
          created_at?: string
          description_long?: string | null
          description_short?: string | null
          email?: string | null
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          is_featured?: boolean | null
          is_premium?: boolean | null
          is_verified?: boolean | null
          landmark?: string | null
          latitude?: number | null
          linkedin_url?: string | null
          logo_url?: string | null
          longitude?: number | null
          name: string
          phone?: string | null
          phone_secondary?: string | null
          slug: string
          status?: Database["public"]["Enums"]["business_status"] | null
          twitter_url?: string | null
          updated_at?: string
          user_id: string
          views_count?: number | null
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          category_id?: string | null
          city_id?: string | null
          commune_id?: string | null
          created_at?: string
          description_long?: string | null
          description_short?: string | null
          email?: string | null
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          is_featured?: boolean | null
          is_premium?: boolean | null
          is_verified?: boolean | null
          landmark?: string | null
          latitude?: number | null
          linkedin_url?: string | null
          logo_url?: string | null
          longitude?: number | null
          name?: string
          phone?: string | null
          phone_secondary?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["business_status"] | null
          twitter_url?: string | null
          updated_at?: string
          user_id?: string
          views_count?: number | null
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "businesses_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "businesses_commune_id_fkey"
            columns: ["commune_id"]
            isOneToOne: false
            referencedRelation: "communes"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      communes: {
        Row: {
          city_id: string
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          city_id: string
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          city_id?: string
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "communes_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      pharmacies_garde: {
        Row: {
          address: string | null
          city_id: string | null
          commune_id: string | null
          created_at: string
          end_date: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          start_date: string
        }
        Insert: {
          address?: string | null
          city_id?: string | null
          commune_id?: string | null
          created_at?: string
          end_date: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          start_date: string
        }
        Update: {
          address?: string | null
          city_id?: string | null
          commune_id?: string | null
          created_at?: string
          end_date?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "pharmacies_garde_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pharmacies_garde_commune_id_fkey"
            columns: ["commune_id"]
            isOneToOne: false
            referencedRelation: "communes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          business_id: string
          comment: string | null
          created_at: string
          id: string
          is_approved: boolean | null
          rating: number
          user_id: string
        }
        Insert: {
          business_id: string
          comment?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean | null
          rating: number
          user_id: string
        }
        Update: {
          business_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean | null
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      business_status:
        | "draft"
        | "pending"
        | "approved"
        | "rejected"
        | "suspended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      business_status: [
        "draft",
        "pending",
        "approved",
        "rejected",
        "suspended",
      ],
    },
  },
} as const
