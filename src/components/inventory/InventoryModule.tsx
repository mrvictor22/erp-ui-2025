import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  ArrowUpCircle,
  ArrowDownCircle,
  Eye,
  RefreshCw,
  AlertTriangle,
  BarChart3,
  X,
  Truck,
  PackageCheck,
  PackageX,
  ArrowLeftRight
} from 'lucide-react';
import { format } from 'date-fns';

interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  minStock: number;
  currentStock: number;
  averageCost: number;
  lastUpdated: string;
}

interface CardexEntry {
  id: string;
  date: string;
  type: 'purchase' | 'sale' | 'adjustment' | 'transfer';
  description: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  balance: {
    quantity: number;
    unitCost: number;
    totalCost: number;
  };
}

// Mock data
const mockProducts: Product[] = [
  {
    id: 'P001',
    code: 'LAP-001',
    name: 'Business Laptop Pro',
    category: 'Electronics',
    unit: 'unit',
    minStock: 10,
    currentStock: 15,
    averageCost: 899.99,
    lastUpdated: '2024-03-10'
  },
  {
    id: 'P002',
    code: 'MON-002',
    name: '27" 4K Monitor',
    category: 'Electronics',
    unit: 'unit',
    minStock: 5,
    currentStock: 3,
    averageCost: 299.99,
    lastUpdated: '2024-03-09'
  }
];

const mockCardexEntries: Record<string, CardexEntry[]> = {
  'P001': [
    {
      id: 'T001',
      date: '2024-03-10',
      type: 'purchase',
      description: 'Initial Stock Purchase',
      quantity: 20,
      unitCost: 850.00,
      totalCost: 17000.00,
      balance: {
        quantity: 20,
        unitCost: 850.00,
        totalCost: 17000.00
      }
    },
    {
      id: 'T002',
      date: '2024-03-10',
      type: 'sale',
      description: 'Customer Sale #S001',
      quantity: -5,
      unitCost: 850.00,
      totalCost: -4250.00,
      balance: {
        quantity: 15,
        unitCost: 850.00,
        totalCost: 12750.00
      }
    }
  ]
};

export function InventoryModule() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCardexModalOpen, setIsCardexModalOpen] = useState(false);
  const [isNewMovementModalOpen, setIsNewMovementModalOpen] = useState(false);
  const [movementType, setMovementType] = useState<'purchase' | 'sale' | 'adjustment' | 'transfer'>('purchase');

  const getStockStatusColor = (product: Product) => {
    if (product.currentStock <= 0) {
      return 'bg-red-100 text-red-800';
    }
    if (product.currentStock <= product.minStock) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-green-100 text-green-800';
  };

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'text-green-600';
      case 'sale':
        return 'text-blue-600';
      case 'adjustment':
        return 'text-yellow-600';
      case 'transfer':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getMovementTypeIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ArrowUpCircle className="w-5 h-5" />;
      case 'sale':
        return <ArrowDownCircle className="w-5 h-5" />;
      case 'adjustment':
        return <RefreshCw className="w-5 h-5" />;
      case 'transfer':
        return <ArrowLeftRight className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Management (CARDEX)</h1>
        <button
          onClick={() => setIsNewMovementModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Movement
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex gap-4 bg-white p-4 rounded-lg shadow">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </button>
        <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
          <Download className="w-5 h-5 mr-2" />
          Export
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold mt-1">1,254</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <Package className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-500 text-sm">+3.2%</span>
              <span className="text-gray-500 text-sm ml-2">from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock Items</p>
              <p className="text-2xl font-bold mt-1">28</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-red-500 text-sm">+8.4%</span>
              <span className="text-gray-500 text-sm ml-2">from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-2xl font-bold mt-1">$425,890</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-500 text-sm">+12.5%</span>
              <span className="text-gray-500 text-sm ml-2">from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Movements Today</p>
              <p className="text-2xl font-bold mt-1">45</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <ArrowLeftRight className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-500 text-sm">+5.8%</span>
              <span className="text-gray-500 text-sm ml-2">from yesterday</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Average Cost
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStockStatusColor(product)}`}>
                    {product.currentStock} / {product.minStock}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${product.averageCost.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${(product.currentStock * product.averageCost).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(product.lastUpdated), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsCardexModalOpen(true);
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="View CARDEX"
                    >
                      <Eye className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CARDEX Modal */}
      {isCardexModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold">CARDEX - {selectedProduct.name}</h2>
                <p className="text-sm text-gray-500">Product Code: {selectedProduct.code}</p>
              </div>
              <button
                onClick={() => setIsCardexModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Summary */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Current Stock</p>
                <p className="text-xl font-bold">{selectedProduct.currentStock}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Average Cost</p>
                <p className="text-xl font-bold">${selectedProduct.averageCost.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Value</p>
                <p className="text-xl font-bold">
                  ${(selectedProduct.currentStock * selectedProduct.averageCost).toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Last Movement</p>
                <p className="text-xl font-bold">{format(new Date(selectedProduct.lastUpdated), 'MMM dd, yyyy')}</p>
              </div>
            </div>

            {/* CARDEX Entries Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockCardexEntries[selectedProduct.id]?.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(entry.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center ${getMovementTypeColor(entry.type)}`}>
                          {getMovementTypeIcon(entry.type)}
                          <span className="ml-2 capitalize">{entry.type}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${entry.unitCost.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${entry.totalCost.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.balance.quantity} units @ ${entry.balance.unitCost.toFixed(2)} = ${entry.balance.totalCost.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* New Movement Modal */}
      {isNewMovementModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">New Inventory Movement</h2>
              <button
                onClick={() => setIsNewMovementModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Movement Type Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <button
                onClick={() => setMovementType('purchase')}
                className={`p-4 rounded-lg border flex flex-col items-center justify-center gap-2 ${
                  movementType === 'purchase' ? 'bg-primary-50 border-primary-500' : 'hover:bg-gray-50'
                }`}
              >
                <Truck className={`w-6 h-6 ${movementType === 'purchase' ? 'text-primary-500' : 'text-gray-400'}`} />
                <span className={movementType === 'purchase' ? 'text-primary-700' : 'text-gray-600'}>Purchase</span>
              </button>
              <button
                onClick={() => setMovementType('sale')}
                className={`p-4 rounded-lg border flex flex-col items-center justify-center gap-2 ${
                  movementType === 'sale' ? 'bg-primary-50 border-primary-500' : 'hover:bg-gray-50'
                }`}
              >
                <PackageCheck className={`w-6 h-6 ${movementType === 'sale' ? 'text-primary-500' : 'text-gray-400'}`} />
                <span className={movementType === 'sale' ? 'text-primary-700' : 'text-gray-600'}>Sale</span>
              </button>
              <button
                onClick={() => setMovementType('adjustment')}
                className={`p-4 rounded-lg border flex flex-col items-center justify-center gap-2 ${
                  movementType === 'adjustment' ? 'bg-primary-50 border-primary-500' : 'hover:bg-gray-50'
                }`}
              >
                <PackageX className={`w-6 h-6 ${movementType === 'adjustment' ? 'text-primary-500' : 'text-gray-400'}`} />
                <span className={movementType === 'adjustment' ? 'text-primary-700' : 'text-gray-600'}>Adjustment</span>
              </button>
              <button
                onClick={() => setMovementType('transfer')}
                className={`p-4 rounded-lg border flex flex-col items-center justify-center gap-2 ${
                  movementType === 'transfer' ? 'bg-primary-50 border-primary-500' : 'hover:bg-gray-50'
                }`}
              >
                <ArrowLeftRight className={`w-6 h-6 ${movementType === 'transfer' ? 'text-primary-500' : 'text-gray-400'}`} />
                <span className={movementType === 'transfer' ? 'text-primary-700' : 'text-gray-600'}>Transfer</span>
              </button>
            </div>

            {/* Movement Form */}
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Select a product</option>
                  {mockProducts.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.code} - {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Cost
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter unit cost"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Enter movement description"
                />
              </div>

              {movementType === 'transfer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination Location
                  </label>
                  <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Select destination</option>
                    <option value="warehouse1">Warehouse 1</option>
                    <option value="warehouse2">Warehouse 2</option>
                    <option value="store1">Store 1</option>
                  </select>
                </div>
              )}
            </form>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsNewMovementModalOpen(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                Create Movement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}