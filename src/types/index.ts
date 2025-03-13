export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  companyId: string;
}

export interface Company {
  id: string;
  name: string;
  taxId: string;
  address: string;
  phone: string;
  email: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  companyId: string;
  taxId?: string;
  notes?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  companyId: string;
  category: string;
  unit: string;
}

export interface Invoice {
  id: string;
  number: string;
  customerId: string;
  companyId: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'issued' | 'paid' | 'void';
}

export interface InvoiceItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
}