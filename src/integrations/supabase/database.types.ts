 
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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agencies: {
        Row: {
          id: number
          minister_id: number | null
          name: string
          open_data_url: string | null
          short_name: string | null
          type: string | null
          website_url: string | null
        }
        Insert: {
          id?: number
          minister_id?: number | null
          name: string
          open_data_url?: string | null
          short_name?: string | null
          type?: string | null
          website_url?: string | null
        }
        Update: {
          id?: number
          minister_id?: number | null
          name?: string
          open_data_url?: string | null
          short_name?: string | null
          type?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agencies_minister_id_fkey"
            columns: ["minister_id"]
            isOneToOne: false
            referencedRelation: "ministers"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          approved_amount: number | null
          created_at: string | null
          disbursed_amount: number | null
          fiscal_year: number | null
          id: number
          planned_amount: number | null
          policy_id: string | null
          reference_document: string | null
          source: string | null
          source_detail: string | null
          updated_at: string | null
        }
        Insert: {
          approved_amount?: number | null
          created_at?: string | null
          disbursed_amount?: number | null
          fiscal_year?: number | null
          id?: number
          planned_amount?: number | null
          policy_id?: string | null
          reference_document?: string | null
          source?: string | null
          source_detail?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_amount?: number | null
          created_at?: string | null
          disbursed_amount?: number | null
          fiscal_year?: number | null
          id?: number
          planned_amount?: number | null
          policy_id?: string | null
          reference_document?: string | null
          source?: string | null
          source_detail?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budgets_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      clusters: {
        Row: {
          color_hex: string
          created_at: string | null
          description: string | null
          icon: string | null
          id: number
          name: string
          short_name: string
        }
        Insert: {
          color_hex: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: number
          name: string
          short_name: string
        }
        Update: {
          color_hex?: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: number
          name?: string
          short_name?: string
        }
        Relationships: []
      }
      community_tips: {
        Row: {
          created_at: string | null
          description: string
          evidence_file_path: string | null
          evidence_url: string | null
          id: number
          location_district: string | null
          location_province: string | null
          policy_id: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          status: string
          submitter_contact_encrypted: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          evidence_file_path?: string | null
          evidence_url?: string | null
          id?: number
          location_district?: string | null
          location_province?: string | null
          policy_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: string
          submitter_contact_encrypted?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          evidence_file_path?: string | null
          evidence_url?: string | null
          id?: number
          location_district?: string | null
          location_province?: string | null
          policy_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: string
          submitter_contact_encrypted?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_tips_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          completed_date: string | null
          created_at: string | null
          id: number
          milestone_order: number
          name: string
          notes: string | null
          policy_id: string | null
          status: string
          target_date: string | null
          updated_at: string | null
          weight_percent: number
        }
        Insert: {
          completed_date?: string | null
          created_at?: string | null
          id?: number
          milestone_order: number
          name: string
          notes?: string | null
          policy_id?: string | null
          status?: string
          target_date?: string | null
          updated_at?: string | null
          weight_percent?: number
        }
        Update: {
          completed_date?: string | null
          created_at?: string | null
          id?: number
          milestone_order?: number
          name?: string
          notes?: string | null
          policy_id?: string | null
          status?: string
          target_date?: string | null
          updated_at?: string | null
          weight_percent?: number
        }
        Relationships: [
          {
            foreignKeyName: "milestones_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      ministers: {
        Row: {
          end_date: string | null
          full_name: string
          id: number
          ministry: string | null
          party: string | null
          photo_url: string | null
          position: string
          start_date: string | null
          title: string
        }
        Insert: {
          end_date?: string | null
          full_name: string
          id?: number
          ministry?: string | null
          party?: string | null
          photo_url?: string | null
          position: string
          start_date?: string | null
          title: string
        }
        Update: {
          end_date?: string | null
          full_name?: string
          id?: number
          ministry?: string | null
          party?: string | null
          photo_url?: string | null
          position?: string
          start_date?: string | null
          title?: string
        }
        Relationships: []
      }
      policies: {
        Row: {
          cluster_id: number | null
          created_at: string | null
          description: string | null
          id: string
          is_featured: boolean | null
          kpis: Json | null
          minister_id: number | null
          original_text: string | null
          policy_number: string
          primary_agency_id: number | null
          priority: string
          progress_percent: number | null
          slug: string
          start_date: string | null
          status: string
          target_date: string | null
          target_date_type: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          cluster_id?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          kpis?: Json | null
          minister_id?: number | null
          original_text?: string | null
          policy_number: string
          primary_agency_id?: number | null
          priority?: string
          progress_percent?: number | null
          slug: string
          start_date?: string | null
          status?: string
          target_date?: string | null
          target_date_type?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          cluster_id?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          kpis?: Json | null
          minister_id?: number | null
          original_text?: string | null
          policy_number?: string
          primary_agency_id?: number | null
          priority?: string
          progress_percent?: number | null
          slug?: string
          start_date?: string | null
          status?: string
          target_date?: string | null
          target_date_type?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "policies_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "clusters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policies_minister_id_fkey"
            columns: ["minister_id"]
            isOneToOne: false
            referencedRelation: "ministers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policies_primary_agency_id_fkey"
            columns: ["primary_agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_agencies: {
        Row: {
          agency_id: number
          policy_id: string
          role: string | null
        }
        Insert: {
          agency_id: number
          policy_id: string
          role?: string | null
        }
        Update: {
          agency_id?: number
          policy_id?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "policy_agencies_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policy_agencies_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      progress_updates: {
        Row: {
          created_at: string | null
          created_by: string | null
          data_source_type: string | null
          description: string
          evidence_urls: Json | null
          id: string
          milestone_id: number | null
          new_status: string | null
          old_status: string | null
          policy_id: string | null
          publish_status: string
          published_at: string | null
          update_type: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          data_source_type?: string | null
          description: string
          evidence_urls?: Json | null
          id?: string
          milestone_id?: number | null
          new_status?: string | null
          old_status?: string | null
          policy_id?: string | null
          publish_status?: string
          published_at?: string | null
          update_type?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          data_source_type?: string | null
          description?: string
          evidence_urls?: Json | null
          id?: string
          milestone_id?: number | null
          new_status?: string | null
          old_status?: string | null
          policy_id?: string | null
          publish_status?: string
          published_at?: string | null
          update_type?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_updates_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_updates_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      public_votes: {
        Row: {
          created_at: string | null
          id: number
          ip_hash: string
          policy_id: string | null
          vote: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          ip_hash: string
          policy_id?: string | null
          vote?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          ip_hash?: string
          policy_id?: string | null
          vote?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_votes_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
