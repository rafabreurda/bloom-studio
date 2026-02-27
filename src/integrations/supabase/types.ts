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
      admin_permissions: {
        Row: {
          agenda: boolean
          clientes: boolean
          config: boolean
          created_at: string
          estoque: boolean
          financeiro: boolean
          fornecedores: boolean
          id: string
          lista_espera: boolean
          parcerias: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          agenda?: boolean
          clientes?: boolean
          config?: boolean
          created_at?: string
          estoque?: boolean
          financeiro?: boolean
          fornecedores?: boolean
          id?: string
          lista_espera?: boolean
          parcerias?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          agenda?: boolean
          clientes?: boolean
          config?: boolean
          created_at?: string
          estoque?: boolean
          financeiro?: boolean
          fornecedores?: boolean
          id?: string
          lista_espera?: boolean
          parcerias?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          charged_value: number
          client_name: string
          cost: number
          created_at: string
          date: string
          id: string
          is_confirmed: boolean
          is_partnership: boolean
          owner_id: string | null
          package_id: string | null
          partnership_discount: number | null
          partnership_id: string | null
          partnership_name: string | null
          payment_method: string | null
          phone: string
          products: Json | null
          products_value: number
          status: string
          tags: string[] | null
          time: string
          total_value: number
          updated_at: string
          value: number
        }
        Insert: {
          charged_value?: number
          client_name: string
          cost?: number
          created_at?: string
          date: string
          id?: string
          is_confirmed?: boolean
          is_partnership?: boolean
          owner_id?: string | null
          package_id?: string | null
          partnership_discount?: number | null
          partnership_id?: string | null
          partnership_name?: string | null
          payment_method?: string | null
          phone: string
          products?: Json | null
          products_value?: number
          status?: string
          tags?: string[] | null
          time: string
          total_value?: number
          updated_at?: string
          value?: number
        }
        Update: {
          charged_value?: number
          client_name?: string
          cost?: number
          created_at?: string
          date?: string
          id?: string
          is_confirmed?: boolean
          is_partnership?: boolean
          owner_id?: string | null
          package_id?: string | null
          partnership_discount?: number | null
          partnership_id?: string | null
          partnership_name?: string | null
          payment_method?: string | null
          phone?: string
          products?: Json | null
          products_value?: number
          status?: string
          tags?: string[] | null
          time?: string
          total_value?: number
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "appointments_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "partnerships"
            referencedColumns: ["id"]
          },
        ]
      }
      blocks: {
        Row: {
          created_at: string
          date: string
          end_date: string | null
          id: string
          owner_id: string | null
          reason: string | null
          time: string | null
          type: string
        }
        Insert: {
          created_at?: string
          date: string
          end_date?: string | null
          id?: string
          owner_id?: string | null
          reason?: string | null
          time?: string | null
          type?: string
        }
        Update: {
          created_at?: string
          date?: string
          end_date?: string | null
          id?: string
          owner_id?: string | null
          reason?: string | null
          time?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocks_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          anamnesis_history: Json | null
          birthday: string | null
          cpf: string | null
          created_at: string
          email: string | null
          history: Json | null
          id: string
          is_vip: boolean
          name: string
          notes: string | null
          owner_id: string | null
          partnership_id: string | null
          phone: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          anamnesis_history?: Json | null
          birthday?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          history?: Json | null
          id?: string
          is_vip?: boolean
          name: string
          notes?: string | null
          owner_id?: string | null
          partnership_id?: string | null
          phone: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          anamnesis_history?: Json | null
          birthday?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          history?: Json | null
          id?: string
          is_vip?: boolean
          name?: string
          notes?: string | null
          owner_id?: string | null
          partnership_id?: string | null
          phone?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "partnerships"
            referencedColumns: ["id"]
          },
        ]
      }
      finances: {
        Row: {
          category: string
          created_at: string
          date: string
          description: string
          id: string
          is_partnership: boolean | null
          owner_id: string | null
          payment_method: string | null
          type: string
          value: number
        }
        Insert: {
          category: string
          created_at?: string
          date: string
          description: string
          id?: string
          is_partnership?: boolean | null
          owner_id?: string | null
          payment_method?: string | null
          type: string
          value: number
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          is_partnership?: boolean | null
          owner_id?: string | null
          payment_method?: string | null
          type?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "finances_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          client_name: string
          client_phone: string | null
          created_at: string
          id: string
          notes: string | null
          owner_id: string | null
          session_value: number | null
          status: string
          total_sessions: number
          total_value: number
          updated_at: string
          used_sessions: number
        }
        Insert: {
          client_name: string
          client_phone?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          owner_id?: string | null
          session_value?: number | null
          status?: string
          total_sessions?: number
          total_value?: number
          updated_at?: string
          used_sessions?: number
        }
        Update: {
          client_name?: string
          client_phone?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          owner_id?: string | null
          session_value?: number | null
          status?: string
          total_sessions?: number
          total_value?: number
          updated_at?: string
          used_sessions?: number
        }
        Relationships: [
          {
            foreignKeyName: "packages_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partnerships: {
        Row: {
          contact: string | null
          created_at: string
          discount: number
          id: string
          name: string
          owner_id: string | null
          updated_at: string
        }
        Insert: {
          contact?: string | null
          created_at?: string
          discount?: number
          id?: string
          name: string
          owner_id?: string | null
          updated_at?: string
        }
        Update: {
          contact?: string | null
          created_at?: string
          discount?: number
          id?: string
          name?: string
          owner_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partnerships_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          password_display: string | null
          password_hash: string | null
          phone: string | null
          photo_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          password_display?: string | null
          password_hash?: string | null
          phone?: string | null
          photo_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          password_display?: string | null
          password_hash?: string | null
          phone?: string | null
          photo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      stock: {
        Row: {
          created_at: string
          id: string
          min_stock: number
          name: string
          owner_id: string | null
          price: number
          quantity: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          min_stock?: number
          name: string
          owner_id?: string | null
          price?: number
          quantity?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          min_stock?: number
          name?: string
          owner_id?: string | null
          price?: number
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          contact: string | null
          created_at: string
          id: string
          name: string
          owner_id: string | null
          products: string | null
          updated_at: string
        }
        Insert: {
          contact?: string | null
          created_at?: string
          id?: string
          name: string
          owner_id?: string | null
          products?: string | null
          updated_at?: string
        }
        Update: {
          contact?: string | null
          created_at?: string
          id?: string
          name?: string
          owner_id?: string | null
          products?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_config: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["admin_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["admin_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["admin_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      waiting_list: {
        Row: {
          created_at: string
          desired_date: string
          id: string
          name: string
          owner_id: string | null
          phone: string
          status: string
        }
        Insert: {
          created_at?: string
          desired_date: string
          id?: string
          name: string
          owner_id?: string | null
          phone: string
          status?: string
        }
        Update: {
          created_at?: string
          desired_date?: string
          id?: string
          name?: string
          owner_id?: string | null
          phone?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "waiting_list_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_admin_role: {
        Args: {
          _role: Database["public"]["Enums"]["admin_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_chefe: { Args: { _user_id: string }; Returns: boolean }
      set_admin_password: {
        Args: { _password: string; _user_id: string }
        Returns: undefined
      }
      verify_admin_password: {
        Args: { _password: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      admin_role: "admin_chefe" | "admin_pleno" | "admin_junior"
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
      admin_role: ["admin_chefe", "admin_pleno", "admin_junior"],
    },
  },
} as const
