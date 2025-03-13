import React, { useState } from 'react';
import { 
  FileText, 
  Receipt, 
  Ticket, 
  Plus, 
  Search, 
  Filter,
  Download,
  Eye,
  Printer,
  Mail,
  X,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';

interface Sale {
  id: string;
  date: string;
  customer: string;
  total: number;
  status: 'completed' | 'pending' | 'cancelled';
  documentType: 'invoice' | 'fiscal' | 'ticket';
}

interface SaleItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

const mockSales: Sale[] = [
  {
    id: 'S001',
    date: '2024-03-10',
    customer: 'John Doe',
    total: 1250.00,
    status: 'completed',
    documentType: 'invoice'
  },
  {
    id: 'S002',
    date: '2024-03-09',
    customer: 'Jane Smith',
    total: 890.50,
    status: 'completed',
    documentType: 'fiscal'
  },
  {
    id: 'S003',
    date: '2024-03-09',
    customer: 'Bob Johnson',
    total: 150.75,
    status: 'pending',
    documentType: 'ticket'
  }
];

const mockProducts = [
  { id: 'P001', name: 'Laptop', price: 999.99 },
  { id: 'P002', name: 'Smartphone', price: 599.99 },
  { id: 'P003', name: 'Headphones', price: 99.99 },
  { id: 'P004', name: 'Monitor', price: 299.99 },
];

const mockCustomers = [
  { id: 'C001', name: 'John Doe', email: 'john@example.com' },
  { id: 'C002', name: 'Jane Smith', email: 'jane@example.com' },
  { id: 'C003', name: 'Bob Johnson', email: 'bob@example.com' },
];

export function SalesModule() {
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);
  const [documentType, setDocumentType] = useState<'invoice' | 'fiscal' | 'ticket'>('invoice');
  
  // New sale form state
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [newItem, setNewItem] = useState({
    productId: '',
    quantity: 1,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGenerateDocument = (sale: Sale, type: 'invoice' | 'fiscal' | 'ticket') => {
    setSelectedSale(sale);
    setDocumentType(type);
    setIsDocumentModalOpen(true);
  };

  const handleAddItem = () => {
    const product = mockProducts.find(p => p.id === newItem.productId);
    if (product) {
      const total = product.price * newItem.quantity;
      setSaleItems([...saleItems, {
        id: Date.now().toString(),
        productName: product.name,
        quantity: newItem.quantity,
        price: product.price,
        total
      }]);
      setNewItem({ productId: '', quantity: 1 });
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setSaleItems(saleItems.filter(item => item.id !== itemId));
  };

  const calculateTotal = () => {
    return saleItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmitSale = () => {
    // Here you would typically make an API call to save the sale
    console.log({
      customer: selectedCustomer,
      items: saleItems,
      total: calculateTotal(),
      date: new Date().toISOString(),
    });
    setIsNewSaleModalOpen(false);
    setSelectedCustomer('');
    setSaleItems([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Sales Management</h1>
        <button 
          onClick={() => setIsNewSaleModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Sale
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex gap-4 bg-white p-4 rounded-lg shadow">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search sales..."
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

      {/* Sales Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sale ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documents
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockSales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {sale.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(sale.date), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {sale.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${sale.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(sale.status)}`}>
                    {sale.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleGenerateDocument(sale, 'invoice')}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Generate Invoice"
                    >
                      <FileText className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleGenerateDocument(sale, 'fiscal')}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Generate Fiscal Credit"
                    >
                      <Receipt className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleGenerateDocument(sale, 'ticket')}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Generate Ticket"
                    >
                      <Ticket className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button className="p-1 hover:bg-gray-100 rounded" title="View Details">
                      <Eye className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded" title="Print">
                      <Printer className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded" title="Send Email">
                      <Mail className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Document Generation Modal */}
      {isDocumentModalOpen && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              Generate {documentType === 'invoice' ? 'Invoice' : documentType === 'fiscal' ? 'Fiscal Credit' : 'Ticket'}
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium">{selectedSale.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sale ID</p>
                  <p className="font-medium">{selectedSale.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{format(new Date(selectedSale.date), 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-medium">${selectedSale.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDocumentModalOpen(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                Generate Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Sale Modal */}
      {isNewSaleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">New Sale</h2>
              <button 
                onClick={() => setIsNewSaleModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer
              </label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select a customer</option>
                {mockCustomers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Items */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Items</h3>
              <div className="flex gap-4 mb-4">
                <select
                  value={newItem.productId}
                  onChange={(e) => setNewItem({ ...newItem, productId: e.target.value })}
                  className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select a product</option>
                  {mockProducts.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ${product.price}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                  className="w-24 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleAddItem}
                  disabled={!newItem.productId}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Item
                </button>
              </div>

              {/* Items Table */}
              {saleItems.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {saleItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.productName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.total.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                          Total:
                        </td>
                        <td colSpan={2} className="px-6 py-4 text-sm font-medium text-gray-900">
                          ${calculateTotal().toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsNewSaleModalOpen(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitSale}
                disabled={!selectedCustomer || saleItems.length === 0}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}