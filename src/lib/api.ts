// API Base URL - replace with your actual API endpoint
const API_BASE_URL = 'https://api.example.com';

// Generic API request handler
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

// Companies API
export interface Company {
  id: string;
  name: string;
  tax_id: string;
  address: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  type: 'headquarters' | 'subsidiary';
  industry: string;
  founded_date: string;
  employee_count: number;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export const companiesApi = {
  getAll: () => request<Company[]>('/companies'),
  getById: (id: string) => request<Company>(`/companies/${id}`),
  create: (data: Omit<Company, 'id' | 'created_at' | 'updated_at'>) =>
    request<Company>('/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Company>) =>
    request<Company>(`/companies/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/companies/${id}`, {
      method: 'DELETE',
    }),
};

// Company Modules API
export interface CompanyModule {
  id: string;
  company_id: string;
  module_name: 'billing' | 'inventory' | 'pos' | 'logistics';
  is_enabled: boolean;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export const companyModulesApi = {
  getByCompanyId: (companyId: string) =>
    request<CompanyModule[]>(`/companies/${companyId}/modules`),
  create: (data: Omit<CompanyModule, 'id' | 'created_at' | 'updated_at'>) =>
    request<CompanyModule>('/company-modules', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<CompanyModule>) =>
    request<CompanyModule>(`/company-modules/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// Company Metrics API
export interface CompanyMetrics {
  id: string;
  company_id: string;
  monthly_revenue: number;
  active_customers: number;
  total_orders: number;
  inventory_value: number;
  recorded_at: string;
  created_at: string;
}

export const companyMetricsApi = {
  getCurrent: (companyId: string) =>
    request<CompanyMetrics>(`/companies/${companyId}/metrics/current`),
  getHistory: (companyId: string) =>
    request<CompanyMetrics[]>(`/companies/${companyId}/metrics/history`),
};