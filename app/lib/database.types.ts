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
          created_at: string
        }
        Insert: {
          id: string
          username: string
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          created_at?: string
        }
      }

      receipts: {
        Row: {
          id: string
          user_id: string
          upload_date: string | null
          status: string
          raw_text: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          upload_date?: string | null
          status: string
          raw_text?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          upload_date?: string | null
          status?: string
          raw_text?: string | null
          created_at?: string
        }
      }

      parsed_receipts: {
        Row: {
          id: string
          receipt_id: string
          vendor: string
          total_amount: number
          tax_amount: number | null
          date: string
          payment_method: string | null
          category: string | null
          remark: string | null
          created_at: string
        }
        Insert: {
          id?: string
          receipt_id: string
          vendor: string
          total_amount: number
          tax_amount?: number | null
          date: string
          payment_method?: string | null
          category?: string | null
          remark?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          receipt_id?: string
          vendor?: string
          total_amount?: number
          tax_amount?: number | null
          date?: string
          payment_method?: string | null
          category?: string | null
          remark?: string | null
          created_at?: string
        }
      }

      receipt_statuses: {
        Row: {
          id: string
          label: string
          sort_order: number
        }
        Insert: {
          id: string
          label: string
          sort_order: number
        }
        Update: {
          id?: string
          label?: string
          sort_order?: number
        }
      }

      categories: {
        Row: {
          id: string
          label: string
          sort_order: number
        }
        Insert: {
          id: string
          label: string
          sort_order: number
        }
        Update: {
          id?: string
          label?: string
          sort_order?: number
        }
      }
    }

    Views: {
      [_ in never]: never;
    };

    Functions: {
      handle_new_user: {
        Args: Record<string, never>; // no args
        Returns: unknown; // trigger returns `NEW row`
      };
    };

    Enums: {
      [_ in never]: never;
    };

    CompositeTypes: {
      [_ in never]: never;
    };

  }
}
