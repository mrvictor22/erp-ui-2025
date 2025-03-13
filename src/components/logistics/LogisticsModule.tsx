import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Package, 
  Calendar,
  Search,
  Filter,
  Plus,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Map,
  RotateCw,
  ArrowRight,
  Users,
  X,
  Save
} from 'lucide-react';
import { format } from 'date-fns';

interface Delivery {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    address: string;
    phone: string;
  };
  items: {
    name: string;
    quantity: number;
  }[];
  status: 'pending' | 'in_transit' | 'delivered' | 'failed';
  driver: string;
  vehicle: string;
  route: string;
  scheduledDate: string;
  estimatedArrival: string;
  actualDelivery?: string;
  priority: 'low' | 'medium' | 'high';
}

interface Route {
  id: string;
  name: string;
  driver: string;
  vehicle: string;
  stops: number;
  status: 'planned' | 'in_progress' | 'completed';
  date: string;
  efficiency: number;
}

interface Vehicle {
  id: string;
  type: string;
  plate: string;
  driver: string;
  status: 'available' | 'in_route' | 'maintenance';
  lastMaintenance: string;
  nextMaintenance: string;
}

interface NewDelivery {
  orderNumber: string;
  customer: {
    name: string;
    address: string;
    phone: string;
  };
  items: {
    name: string;
    quantity: number;
  }[];
  driver: string;
  vehicle: string;
  route: string;
  scheduledDate: string;
  estimatedArrival: string;
  priority: 'low' | 'medium' | 'high';
}

interface Driver {
  id: string;
  name: string;
  available: boolean;
}

const mockDeliveries: Delivery[] = [
  {
    id: 'D001',
    orderNumber: 'ORD-2024-001',
    customer: {
      name: 'John Smith',
      address: '123 Main St, City',
      phone: '555-0123'
    },
    items: [
      { name: 'Laptop Pro X1', quantity: 1 },
      { name: 'Wireless Mouse', quantity: 2 }
    ],
    status: 'in_transit',
    driver: 'Mike Johnson',
    vehicle: 'Van 001',
    route: 'Route A',
    scheduledDate: '2024-03-10',
    estimatedArrival: '2024-03-10T14:30:00',
    priority: 'high'
  },
  {
    id: 'D002',
    orderNumber: 'ORD-2024-002',
    customer: {
      name: 'Jane Doe',
      address: '456 Oak St, Town',
      phone: '555-0124'
    },
    items: [
      { name: 'Gaming Monitor', quantity: 1 }
    ],
    status: 'pending',
    driver: 'Sarah Wilson',
    vehicle: 'Van 002',
    route: 'Route B',
    scheduledDate: '2024-03-11',
    estimatedArrival: '2024-03-11T10:00:00',
    priority: 'medium'
  }
];

const mockRoutes: Route[] = [
  {
    id: 'R001',
    name: 'Route A',
    driver: 'Mike Johnson',
    vehicle: 'Van 001',
    stops: 5,
    status: 'in_progress',
    date: '2024-03-10',
    efficiency: 92
  },
  {
    id: 'R002',
    name: 'Route B',
    driver: 'Sarah Wilson',
    vehicle: 'Van 002',
    stops: 4,
    status: 'planned',
    date: '2024-03-11',
    efficiency: 88
  }
];

const mockVehicles: Vehicle[] = [
  {
    id: 'V001',
    type: 'Delivery Van',
    plate: 'VAN-001',
    driver: 'Mike Johnson',
    status: 'in_route',
    lastMaintenance: '2024-02-15',
    nextMaintenance: '2024-03-15'
  },
  {
    id: 'V002',
    type: 'Delivery Van',
    plate: 'VAN-002',
    driver: 'Sarah Wilson',
    status: 'available',
    lastMaintenance: '2024-02-20',
    nextMaintenance: '2024-03-20'
  }
];

const mockProducts = [
  { id: 'P001', name: 'Laptop Pro X1', price: 1299.99 },
  { id: 'P002', name: 'Wireless Mouse', price: 29.99 },
  { id: 'P003', name: 'Gaming Monitor', price: 499.99 },
  { id: 'P004', name: 'Mechanical Keyboard', price: 149.99 }
];

const mockDrivers: Driver[] = [
  { id: 'D001', name: 'Mike Johnson', available: true },
  { id: 'D002', name: 'Sarah Wilson', available: true },
  { id: 'D003', name: 'John Davis', available: false }
];

export function LogisticsModule() {
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isNewDeliveryModalOpen, setIsNewDeliveryModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'deliveries' | 'routes' | 'vehicles'>('deliveries');
  const [newDelivery, setNewDelivery] = useState<NewDelivery>({
    orderNumber: '',
    customer: {
      name: '',
      address: '',
      phone: ''
    },
    items: [],
    driver: '',
    vehicle: '',
    route: '',
    scheduledDate: '',
    estimatedArrival: '',
    priority: 'medium'
  });
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 1
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'completed':
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
      case 'in_progress':
      case 'in_route':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      case 'planned':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'in_transit':
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'pending':
      case 'planned':
        return <AlertTriangle className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleAddItem = () => {
    if (newItem.name && newItem.quantity > 0) {
      setNewDelivery(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }));
      setNewItem({ name: '', quantity: 1 });
    }
  };

  const handleRemoveItem = (index: number) => {
    setNewDelivery(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleCreateDelivery = () => {
    // Here you would typically make an API call to create the delivery
    console.log('Creating delivery:', newDelivery);
    
    // Reset form and close modal
    setNewDelivery({
      orderNumber: '',
      customer: {
        name: '',
        address: '',
        phone: ''
      },
      items: [],
      driver: '',
      vehicle: '',
      route: '',
      scheduledDate: '',
      estimatedArrival: '',
      priority: 'medium'
    });
    setIsNewDeliveryModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Logistics Management</h1>
        <button
          onClick={() => setIsNewDeliveryModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Delivery
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Deliveries</p>
              <p className="text-2xl font-bold mt-1">24</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <Package className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-500 text-sm">+5.2%</span>
              <span className="text-gray-500 text-sm ml-2">from yesterday</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">On-Time Delivery</p>
              <p className="text-2xl font-bold mt-1">94%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-500 text-sm">+2.1%</span>
              <span className="text-gray-500 text-sm ml-2">from last week</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Routes</p>
              <p className="text-2xl font-bold mt-1">8</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Map className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-gray-500 text-sm">Current efficiency</span>
              <span className="text-green-500 text-sm ml-2">90%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Available Vehicles</p>
              <p className="text-2xl font-bold mt-1">12</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Truck className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-yellow-500 text-sm">2</span>
              <span className="text-gray-500 text-sm ml-2">in maintenance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('deliveries')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'deliveries'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Deliveries
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'routes'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Routes
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'vehicles'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Vehicles
          </button>
        </nav>
      </div>

      {/* Filters and Search */}
      <div className="flex gap-4 bg-white p-4 rounded-lg shadow">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'deliveries' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockDeliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {delivery.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery.customer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery.route}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery.driver}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(delivery.scheduledDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(delivery.priority)}`}>
                      {delivery.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(delivery.status)}`}>
                      {getStatusIcon(delivery.status)}
                      <span className="ml-1 capitalize">{delivery.status.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => {
                        setSelectedDelivery(delivery);
                        setIsDeliveryModalOpen(true);
                      }}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'routes' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stops
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Efficiency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockRoutes.map((route) => (
                <tr key={route.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {route.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.driver}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.vehicle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.stops}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(route.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${route.efficiency}%` }}
                        />
                      </div>
                      <span>{route.efficiency}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(route.status)}`}>
                      {getStatusIcon(route.status)}
                      <span className="ml-1 capitalize">{route.status.replace('_', ' ')}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'vehicles' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Maintenance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Maintenance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {vehicle.plate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle.driver}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(vehicle.lastMaintenance), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(vehicle.nextMaintenance), 'MMM dd, yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delivery Details Modal */}
      {isDeliveryModalOpen && selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Delivery Details</h2>
              <button
                onClick={() => setIsDeliveryModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Order Information */}
              <div>
                <h3 className="text-lg font-medium mb-2">Order Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="font-medium">{selectedDelivery.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedDelivery.status)}`}>
                      {getStatusIcon(selectedDelivery.status)}
                      <span className="ml-1 capitalize">{selectedDelivery.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-medium mb-2">Customer Information</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-500">Name:</span> {selectedDelivery.customer.name}</p>
                  <p><span className="text-gray-500">Address:</span> {selectedDelivery.customer.address}</p>
                  <p><span className="text-gray-500">Phone:</span> {selectedDelivery.customer.phone}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-lg font-medium mb-2">Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedDelivery.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Delivery Information */}
              <div>
                <h3 className="text-lg font-medium mb-2">Delivery Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Driver</p>
                    <p className="font-medium">{selectedDelivery.driver}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vehicle</p>
                    <p className="font-medium">{selectedDelivery.vehicle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Route</p>
                    <p className="font-medium">{selectedDelivery.route}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Scheduled Date</p>
                    <p className="font-medium">{format(new Date(selectedDelivery.scheduledDate), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Delivery Modal */}
      {isNewDeliveryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">New Delivery</h2>
              <button
                onClick={() => setIsNewDeliveryModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Order Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Order Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Order Number</label>
                    <input
                      type="text"
                      value={newDelivery.orderNumber}
                      onChange={(e) => setNewDelivery(prev => ({ ...prev, orderNumber: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Customer Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={newDelivery.customer.name}
                      onChange={(e) => setNewDelivery(prev => ({
                        ...prev,
                        customer: { ...prev.customer, name: e.target.value }
                      }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      value={newDelivery.customer.address}
                      onChange={(e) => setNewDelivery(prev => ({
                        ...prev,
                        customer: { ...prev.customer, address: e.target.value }
                      }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="text"
                      value={newDelivery.customer.phone}
                      onChange={(e) => setNewDelivery(prev => ({
                        ...prev,
                        customer: { ...prev.customer, phone: e.target.value }
                      }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-lg font-medium mb-4">Items</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">Item Name</label>
                      <input
                        type="text"
                        value={newItem.name}
                        onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    <div className="w-32">
                      <label className="block text-sm font-medium text-gray-700">Quantity</label>
                      <input
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                        min="1"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={handleAddItem}
                        className="mb-1 p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {newDelivery.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={() => handleRemoveItem(index)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Delivery Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Driver</label>
                    <select
                      value={newDelivery.driver}
                      onChange={(e) => setNewDelivery(prev => ({ ...prev, driver: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="">Select a driver</option>
                      {mockDrivers.map(driver => (
                        <option key={driver.id} value={driver.name} disabled={!driver.available}>
                          {driver.name} {!driver.available && '(Unavailable)'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vehicle</label>
                    <select
                      value={newDelivery.vehicle}
                      onChange={(e) => setNewDelivery(prev => ({ ...prev, vehicle: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="">Select a vehicle</option>
                      {mockVehicles.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.plate} disabled={vehicle.status !== 'available'}>
                          {vehicle.plate} {vehicle.status !== 'available' && `(${vehicle.status})`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Route</label>
                    <select
                      value={newDelivery.route}
                      onChange={(e) => setNewDelivery(prev => ({ ...prev, route: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="">Select a route</option>
                      {mockRoutes.map(route => (
                        <option key={route.id} value={route.name}>
                          {route.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                      value={newDelivery.priority}
                      onChange={(e) => setNewDelivery(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Scheduled Date</label>
                    <input
                      type="date"
                      value={newDelivery.scheduledDate}
                      onChange={(e) => setNewDelivery(prev => ({ ...prev, scheduledDate: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estimated Arrival</label>
                    <input
                      type="datetime-local"
                      value={newDelivery.estimatedArrival}
                      onChange={(e) => setNewDelivery(prev => ({ ...prev, estimatedArrival: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsNewDeliveryModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDelivery}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Create Delivery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}