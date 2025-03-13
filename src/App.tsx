import React from 'react';
import { 
  RouterProvider, 
  createRouter, 
  createRootRoute, 
  createRoute 
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { SalesModule } from './components/sales/SalesModule';
import { BillingModule } from './components/billing/BillingModule';
import { InventoryModule } from './components/inventory/InventoryModule';

// Create root route with Layout
const rootRoute = createRootRoute({
  component: Layout,
});

// Create individual routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const billingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/billing',
  component: BillingModule,
});

const salesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sales',
  component: SalesModule,
});

const inventoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inventory',
  component: InventoryModule,
});

const posRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pos',
  component: () => <div>Point of Sale</div>,
});

const logisticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/logistics',
  component: () => <div>Logistics Module</div>,
});

const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customers',
  component: () => <div>Customer Management</div>,
});

const companiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/companies',
  component: () => <div>Companies Module</div>,
});

// Create router and query client
const queryClient = new QueryClient();
const routeTree = rootRoute.addChildren([
  indexRoute,
  billingRoute,
  salesRoute,
  inventoryRoute,
  posRoute,
  logisticsRoute,
  customersRoute,
  companiesRoute,
]);

const router = createRouter({ routeTree });

// Register router for type-safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App