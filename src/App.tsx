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
import { POSModule } from './components/pos/POSModule';
import { LogisticsModule } from './components/logistics/LogisticsModule';
import { CustomersModule } from './components/customers/CustomersModule';
import { CompaniesModule } from './components/companies/CompaniesModule';

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
  component: POSModule,
});

const logisticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/logistics',
  component: LogisticsModule,
});

const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customers',
  component: CustomersModule,
});

const companiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/companies',
  component: CompaniesModule,
});

// Create router and query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

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

export default App;