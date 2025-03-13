import React from 'react';
import { Link, Outlet } from '@tanstack/react-router';
import { 
  LayoutDashboard, 
  FileText, 
  ShoppingCart, 
  Package, 
  Store, 
  Truck, 
  Users, 
  Building2,
  LogOut 
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
  { icon: FileText, label: 'Billing', to: '/billing' },
  { icon: ShoppingCart, label: 'Sales', to: '/sales' },
  { icon: Package, label: 'Inventory', to: '/inventory' },
  { icon: Store, label: 'POS', to: '/pos' },
  { icon: Truck, label: 'Logistics', to: '/logistics' },
  { icon: Users, label: 'Customers', to: '/customers' },
  { icon: Building2, label: 'Companies', to: '/companies' },
];

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b">
            <h1 className="text-xl font-bold text-gray-800">ERP System</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                    activeProps={{ className: 'bg-blue-50 text-blue-700' }}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Menu */}
          <div className="p-4 border-t">
            <button className="flex items-center w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}