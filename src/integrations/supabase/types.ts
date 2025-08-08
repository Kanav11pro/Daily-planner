export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      celebration_triggers: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          trigger_type: string
          trigger_value: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          trigger_type: string
          trigger_value: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          trigger_type?: string
          trigger_value?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      practice_chapters: {
        Row: {
          chapter_name: string
          created_at: string
          id: string
          last_practiced: string | null
          mastery_level: number | null
          revision_priority: number | null
          subject: string
          total_questions: number
          total_time: number
          updated_at: string
          user_id: string
        }
        Insert: {
          chapter_name: string
          created_at?: string
          id?: string
          last_practiced?: string | null
          mastery_level?: number | null
          revision_priority?: number | null
          subject: string
          total_questions?: number
          total_time?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          chapter_name?: string
          created_at?: string
          id?: string
          last_practiced?: string | null
          mastery_level?: number | null
          revision_priority?: number | null
          subject?: string
          total_questions?: number
          total_time?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      practice_sessions: {
        Row: {
          accuracy_percentage: number | null
          celebration_shown: boolean | null
          chapter: string
          created_at: string
          date: string
          difficulty_level: string | null
          id: string
          notes: string | null
          questions_solved: number
          questions_target: number
          source: string
          source_details: string | null
          streak_day: number | null
          subject: string
          time_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          accuracy_percentage?: number | null
          celebration_shown?: boolean | null
          chapter: string
          created_at?: string
          date: string
          difficulty_level?: string | null
          id?: string
          notes?: string | null
          questions_solved?: number
          questions_target?: number
          source: string
          source_details?: string | null
          streak_day?: number | null
          subject: string
          time_spent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          accuracy_percentage?: number | null
          celebration_shown?: boolean | null
          chapter?: string
          created_at?: string
          date?: string
          difficulty_level?: string | null
          id?: string
          notes?: string | null
          questions_solved?: number
          questions_target?: number
          source?: string
          source_details?: string | null
          streak_day?: number | null
          subject?: string
          time_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      practice_targets: {
        Row: {
          accountability_score: number | null
          best_streak: number | null
          created_at: string
          end_date: string
          id: string
          last_reminder: string | null
          motivation_level: string | null
          questions_target: number
          reminder_enabled: boolean | null
          start_date: string
          streak_count: number | null
          subject: string
          target_type: string
          time_target: number
          updated_at: string
          user_id: string
        }
        Insert: {
          accountability_score?: number | null
          best_streak?: number | null
          created_at?: string
          end_date: string
          id?: string
          last_reminder?: string | null
          motivation_level?: string | null
          questions_target?: number
          reminder_enabled?: boolean | null
          start_date: string
          streak_count?: number | null
          subject: string
          target_type: string
          time_target?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          accountability_score?: number | null
          best_streak?: number | null
          created_at?: string
          end_date?: string
          id?: string
          last_reminder?: string | null
          motivation_level?: string | null
          questions_target?: number
          reminder_enabled?: boolean | null
          start_date?: string
          streak_count?: number | null
          subject?: string
          target_type?: string
          time_target?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_seed: string | null
          avatar_url: string | null
          challenge: string | null
          created_at: string
          exam: string | null
          exam_other: string | null
          full_name: string | null
          id: string
          institute: string | null
          institute_other: string | null
          onboarding_completed: boolean | null
          study_hours: string | null
          updated_at: string
        }
        Insert: {
          avatar_seed?: string | null
          avatar_url?: string | null
          challenge?: string | null
          created_at?: string
          exam?: string | null
          exam_other?: string | null
          full_name?: string | null
          id: string
          institute?: string | null
          institute_other?: string | null
          onboarding_completed?: boolean | null
          study_hours?: string | null
          updated_at?: string
        }
        Update: {
          avatar_seed?: string | null
          avatar_url?: string | null
          challenge?: string | null
          created_at?: string
          exam?: string | null
          exam_other?: string | null
          full_name?: string | null
          id?: string
          institute?: string | null
          institute_other?: string | null
          onboarding_completed?: boolean | null
          study_hours?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          chapter: string | null
          completed: boolean | null
          created_at: string
          description: string | null
          duration: number | null
          id: string
          priority: string | null
          scheduled_date: string
          subject: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          chapter?: string | null
          completed?: boolean | null
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          priority?: string | null
          scheduled_date: string
          subject: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          chapter?: string | null
          completed?: boolean | null
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          priority?: string | null
          scheduled_date?: string
          subject?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
