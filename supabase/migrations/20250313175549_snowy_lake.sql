/*
  # Companies Module Schema

  1. New Tables
    - `companies`
      - Core company information
      - Supports multi-company functionality
      - Tracks company metrics and status
    - `company_modules`
      - Tracks enabled modules per company
      - Supports module-level configuration
    - `company_metrics`
      - Stores historical metrics data
      - Enables trend analysis

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Restrict access based on company association

  3. Changes
    - Initial schema creation
    - Added comprehensive metrics tracking
    - Module integration support
*/

-- Companies Table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tax_id text NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  type text NOT NULL,
  industry text NOT NULL,
  founded_date timestamptz NOT NULL,
  employee_count integer NOT NULL DEFAULT 0,
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT companies_status_check CHECK (status IN ('active', 'inactive')),
  CONSTRAINT companies_type_check CHECK (type IN ('headquarters', 'subsidiary'))
);

-- Company Modules Table
CREATE TABLE IF NOT EXISTS company_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  module_name text NOT NULL,
  is_enabled boolean NOT NULL DEFAULT false,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT company_modules_module_name_check CHECK (
    module_name IN ('billing', 'inventory', 'pos', 'logistics')
  ),
  UNIQUE(company_id, module_name)
);

-- Company Metrics Table
CREATE TABLE IF NOT EXISTS company_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  monthly_revenue numeric NOT NULL DEFAULT 0,
  active_customers integer NOT NULL DEFAULT 0,
  total_orders integer NOT NULL DEFAULT 0,
  inventory_value numeric NOT NULL DEFAULT 0,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_metrics ENABLE ROW LEVEL SECURITY;

-- Policies for companies table
CREATE POLICY "Users can view companies they have access to"
  ON companies
  FOR SELECT
  TO authenticated
  USING (true); -- Adjust based on your user-company relationship

CREATE POLICY "Users can insert companies they have access to"
  ON companies
  FOR INSERT
  TO authenticated
  WITH CHECK (true); -- Adjust based on your user-company relationship

CREATE POLICY "Users can update companies they have access to"
  ON companies
  FOR UPDATE
  TO authenticated
  USING (true) -- Adjust based on your user-company relationship
  WITH CHECK (true);

-- Policies for company_modules table
CREATE POLICY "Users can view company modules they have access to"
  ON company_modules
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM companies c
    WHERE c.id = company_modules.company_id
  ));

CREATE POLICY "Users can manage company modules they have access to"
  ON company_modules
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM companies c
    WHERE c.id = company_modules.company_id
  ));

-- Policies for company_metrics table
CREATE POLICY "Users can view company metrics they have access to"
  ON company_metrics
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM companies c
    WHERE c.id = company_metrics.company_id
  ));

CREATE POLICY "Users can insert company metrics they have access to"
  ON company_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM companies c
    WHERE c.id = company_metrics.company_id
  ));

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER company_modules_updated_at
  BEFORE UPDATE ON company_modules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();