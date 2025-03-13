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
      companies: {
        Row: {
          id: string
          name: string
          tax_id: string
          address: string
          phone: string
          email: string
          status: 'active' | 'inactive'
          type: 'headquarters' | 'subsidiary'
          industry: string
          founded_date: string
          employee_count: number
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          tax_id: string
          address: string
          phone: string
          email: string
          status?: 'active' | 'inactive'
          type: 'headquarters' | 'subsidiary'
          industry: string
          founded_date: string
          employee_count: number
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          tax_id?: string
          address?: string
          phone?: string
          email?: string
          status?: 'active' | 'inactive'
          type?: 'headquarters' | 'subsidiary'
          industry?: string
          founded_date?: string
          employee_count?: number
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      company_modules: {
        Row: {
          id: string
          company_id: string
          module_name: 'billing' | 'inventory' | 'pos' | 'logistics'
          is_enabled: boolean
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          module_name: 'billing' | 'inventory' | 'pos' | 'logistics'
          is_enabled?: boolean
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          module_name?: 'billing' | 'inventory' | 'pos' | 'logistics'
          is_enabled?: boolean
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      company_metrics: {
        Row: {
          id: string
          company_id: string
          monthly_revenue: number
          active_customers: number
          total_orders: number
          inventory_value: number
          recorded_at: string
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          monthly_revenue: number
          active_customers: number
          total_orders: number
          inventory_value: number
          recorded_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          monthly_revenue?: number
          active_customers?: number
          total_orders?: number
          inventory_value?: number
          recorded_at?: string
          created_at?: string
        }
      }
    }
  }
}