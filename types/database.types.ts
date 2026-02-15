export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          is_premium: boolean
          is_staff: boolean
          subscription_start: string | null
          subscription_end: string | null
          study_goal_hours: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          is_premium?: boolean
          is_staff?: boolean
          subscription_start?: string | null
          subscription_end?: string | null
          study_goal_hours?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          is_premium?: boolean
          is_staff?: boolean
          subscription_start?: string | null
          subscription_end?: string | null
          study_goal_hours?: number
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string
          color: string
          background_image: string | null
          is_premium: boolean
          order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string
          color?: string
          background_image?: string | null
          is_premium?: boolean
          order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string
          color?: string
          background_image?: string | null
          is_premium?: boolean
          order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      modules: {
        Row: {
          id: string
          category_id: string
          name: string
          description: string | null
          background_image: string | null
          order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          description?: string | null
          background_image?: string | null
          order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          description?: string | null
          background_image?: string | null
          order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          module_id: string
          name: string
          description: string | null
          estimated_hours: number
          order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          module_id: string
          name: string
          description?: string | null
          estimated_hours?: number
          order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          module_id?: string
          name?: string
          description?: string | null
          estimated_hours?: number
          order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          name: string
          plan_type: string
          description: string | null
          price: number
          features: string | null
          max_categories: number
          max_modules: number
          has_premium_categories: boolean
          has_analytics: boolean
          has_export: boolean
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          plan_type: string
          description?: string | null
          price: number
          features?: string | null
          max_categories?: number
          max_modules?: number
          has_premium_categories?: boolean
          has_analytics?: boolean
          has_export?: boolean
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          plan_type?: string
          description?: string | null
          price?: number
          features?: string | null
          max_categories?: number
          max_modules?: number
          has_premium_categories?: boolean
          has_analytics?: boolean
          has_export?: boolean
          is_active?: boolean
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          status: string
          start_date: string
          end_date: string | null
          payment_method: string | null
          last_payment_date: string | null
          next_payment_date: string | null
          auto_renew: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          status?: string
          start_date: string
          end_date?: string | null
          payment_method?: string | null
          last_payment_date?: string | null
          next_payment_date?: string | null
          auto_renew?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          status?: string
          start_date?: string
          end_date?: string | null
          payment_method?: string | null
          last_payment_date?: string | null
          next_payment_date?: string | null
          auto_renew?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      study_sessions: {
        Row: {
          id: string
          user_id: string
          subject_id: string
          duration: number
          date: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id: string
          duration: number
          date: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string
          duration?: number
          date?: string
          notes?: string | null
          created_at?: string
        }
      }
      schedules: {
        Row: {
          id: string
          user_id: string
          subject_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_active?: boolean
          created_at?: string
        }
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
  }
}
