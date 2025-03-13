import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Mail,
  Phone,
  MapPin,
  Star,
  MessageSquare,
  BarChart3,
  Tags,
  Clock,
  X,
  Edit,
  Trash2,
  Save,
  FileText,
  Send,
  Building2,
  CreditCard,
  User,
  Hash,
  ShoppingBag
} from 'lucide-react';
import { format } from 'date-fns';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: 'individual' | 'business';
  status: 'active' | 'inactive';
  joinDate: string;
  lastPurchase?: string;
  totalPurchases: number;
  loyaltyPoints: number;
  tags: string[];
  notes: string;
}

interface Purchase {
  id: string;
  date: string;
  amount: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  status: 'completed' | 'refunded';
}

interface Communication {
  id: string;
  type: 'email' | 'call' | 'note';
  date: string;
  subject?: string;
  content: string;
  status: 'sent' | 'received' | 'pending';
}

interface NewCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  type: 'individual' | 'business';
  taxId?: string;
  companyName?: string;
  website?: string;
  tags: string[];
  notes: string;
}

// Mock data
const mockCustomers: Customer[] = [
  {
    id: 'C001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '555-0123',
    address: '123 Main St, City',
    type: 'individual',
    status: 'active',
    joinDate: '2023-01-15',
    lastPurchase: '2024-03-01',
    totalPurchases: 12,
    loyaltyPoints: 450,
    tags: ['premium', 'tech-savvy'],
    notes: 'Prefers email communication'
  },
  {
    id: 'C002',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '555-0124',
    address: '456 Business Ave, City',
    type: 'business',
    status: 'active',
    joinDate: '2023-03-20',
    lastPurchase: '2024-03-05',
    totalPurchases: 48,
    loyaltyPoints: 2400,
    tags: ['enterprise', 'bulk-buyer'],
    notes: 'Monthly bulk orders'
  }
];

const mockPurchases: Record<string, Purchase[]> = {
  'C001': [
    {
      id: 'P001',
      date: '2024-03-01',
      amount: 1299.99,
      items: [
        { name: 'Laptop Pro X1', quantity: 1, price: 1299.99 }
      ],
      status: 'completed'
    },
    {
      id: 'P002',
      date: '2024-02-15',
      amount: 299.98,
      items: [
        { name: 'Wireless Mouse', quantity: 2, price: 149.99 }
      ],
      status: 'completed'
    }
  ]
};

const mockCommunications: Record<string, Communication[]> = {
  'C001': [
    {
      id: 'CM001',
      type: 'email',
      date: '2024-03-05',
      subject: 'Order Confirmation',
      content: 'Thank you for your recent purchase...',
      status: 'sent'
    },
    {
      id: 'CM002',
      type: 'call',
      date: '2024-03-02',
      content: 'Customer called about product warranty',
      status: 'received'
    }
  ]
};

export function CustomersModule() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [isNewCommunicationModalOpen, setIsNewCommunicationModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'purchases' | 'communications'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newCustomer, setNewCustomer] = useState<NewCustomer>({
    name: '',
    email: '',
    phone: '',
    address: '',
    type: 'individual',
    tags: [],
    notes: ''
  });
  const [newTag, setNewTag] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'inactive':
      case 'refunded':
        return 'bg-red-100 text-red-800';
      case 'received':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCommunicationIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'note':
        return <FileText className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => customer.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const allTags = Array.from(new Set(mockCustomers.flatMap(customer => customer.tags)));

  const handleAddTag = () => {
    if (newTag.trim() && !newCustomer.tags.includes(newTag.trim())) {
      setNewCustomer(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewCustomer(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleCreateCustomer = () => {
    // Here you would typically make an API call to create the customer
    console.log('Creating customer:', newCustomer);
    
    // Reset form and close modal
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      address: '',
      type: 'individual',
      tags: [],
      notes: ''
    });
    setIsNewCustomerModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
        <button
          onClick={() => setIsNewCustomerModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Customer
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Customers</p>
              <p className="text-2xl font-bold mt-1">1,234</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-primary-600" />
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
              <p className="text-sm text-gray-500">Active Customers</p>
              <p className="text-2xl font-bold mt-1">892</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Star className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-500 text-sm">+5.2%</span>
              <span className="text-gray-500 text-sm ml-2">from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Purchase</p>
              <p className="text-2xl font-bold mt-1">$458</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-500 text-sm">+8.4%</span>
              <span className="text-gray-500 text-sm ml-2">from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Customer Satisfaction</p>
              <p className="text-2xl font-bold mt-1">94%</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <MessageSquare className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-500 text-sm">+2.1%</span>
              <span className="text-gray-500 text-sm ml-2">from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex gap-4 bg-white p-4 rounded-lg shadow">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => {
                setSelectedTags(current =>
                  current.includes(tag)
                    ? current.filter(t => t !== tag)
                    : [...current, tag]
                );
              }}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTags.includes(tag)
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Join Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Purchases
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
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-700 font-medium text-lg">
                          {customer.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      <div className="flex gap-1">
                        {customer.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{customer.email}</div>
                  <div className="text-sm text-gray-500">{customer.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="capitalize">{customer.type}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(customer.joinDate), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${(customer.totalPurchases * 100).toFixed(2)}</div>
                  <div className="text-sm text-gray-500">{customer.totalPurchases} orders</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                    {customer.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setIsCustomerModalOpen(true);
                      }}
                      className="text-primary-600 hover:text-primary-900"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsNewCommunicationModalOpen(true)}
                      className="text-gray-600 hover:text-gray-900"
                      title="New Communication"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Details Modal */}
      {isCustomerModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                  <span className="text-primary-700 font-medium text-lg">
                    {selectedCustomer.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedCustomer.name}</h2>
                  <p className="text-sm text-gray-500">Customer since {format(new Date(selectedCustomer.joinDate), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              <button
                onClick={() => setIsCustomerModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('purchases')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'purchases'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Purchase History
                </button>
                <button
                  onClick={() => setActiveTab('communications')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'communications'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Communications
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{selectedCustomer.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{selectedCustomer.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium capitalize">{selectedCustomer.type}</p>
                    </div>
                  </div>
                </div>

                {/* Customer Stats */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Customer Statistics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Total Purchases</p>
                      <p className="text-xl font-bold">${(selectedCustomer.totalPurchases * 100).toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{selectedCustomer.totalPurchases} orders</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Loyalty Points</p>
                      <p className="text-xl font-bold">{selectedCustomer.loyaltyPoints}</p>
                      <p className="text-sm text-gray-500">Points earned</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Last Purchase</p>
                      <p className="text-xl font-bold">
                        {selectedCustomer.lastPurchase
                          ? format(new Date(selectedCustomer.lastPurchase), 'MMM dd, yyyy')
                          : 'No purchases yet'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCustomer.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Notes</h3>
                  <textarea
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={4}
                    defaultValue={selectedCustomer.notes}
                  />
                </div>
              </div>
            )}

            {activeTab === 'purchases' && (
              <div className="space-y-4">
                {mockPurchases[selectedCustomer.id]?.map((purchase) => (
                  <div key={purchase.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-medium">Order #{purchase.id}</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(purchase.date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(purchase.status)}`}>
                        {purchase.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {purchase.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span>${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-medium">${purchase.amount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'communications' && (
              <div className="space-y-4">
                <button
                  onClick={() => setIsNewCommunicationModalOpen(true)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-dashed rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Communication
                </button>
                {mockCommunications[selectedCustomer.id]?.map((comm) => (
                  <div key={comm.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        {getCommunicationIcon(comm.type)}
                        <span className="ml-2 font-medium capitalize">{comm.type}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(comm.status)}`}>
                        {comm.status}
                      </span>
                    </div>
                    {comm.subject && (
                      <p className="text-sm font-medium mb-2">{comm.subject}</p>
                    )}
                    <p className="text-sm text-gray-600">{comm.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {format(new Date(comm.date), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Customer Modal */}
      {isNewCustomerModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">New Customer</h2>
              <button
                onClick={() => setIsNewCustomerModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setNewCustomer(prev => ({ ...prev, type: 'individual' }))}
                    className={`p-4 flex flex-col items-center justify-center border rounded-lg gap-2 ${
                      newCustomer.type === 'individual'
                        ? 'bg-primary-50 border-primary-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <User className={`w-6 h-6 ${newCustomer.type === 'individual' ? 'text-primary-500' : 'text-gray-400'}`} />
                    <span className={newCustomer.type === 'individual' ? 'text-primary-700' : 'text-gray-600'}>
                      Individual
                    </span>
                  </button>
                  <button
                    onClick={() => setNewCustomer(prev => ({ ...prev, type: 'business' }))}
                    className={`p-4 flex flex-col items-center justify-center border rounded-lg gap-2 ${
                      newCustomer.type === 'business'
                        ? 'bg-primary-50 border-primary-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Building2 className={`w-6 h-6 ${newCustomer.type === 'business' ? 'text-primary-500' : 'text-gray-400'}`} />
                    <span className={newCustomer.type === 'business' ? 'text-primary-700' : 'text-gray-600'}>
                      Business
                    </span>
                  </button>
                </div>
              </div>

              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {newCustomer.type === 'business' ? 'Company Name' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {newCustomer.type === 'business' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tax ID
                        </label>
                        <input
                          type="text"
                          value={newCustomer.taxId || ''}
                          onChange={(e) => setNewCustomer(prev => ({ ...prev, taxId: e.target.value }))}
                          className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Website
                        </label>
                        <input
                          type="url"
                          value={newCustomer.website || ''}
                          onChange={(e) => setNewCustomer(prev => ({ ...prev, website: e.target.value }))}
                          className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-medium mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {newCustomer.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 flex items-center"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="Add a tag..."
                    className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-lg font-medium mb-4">Notes</h3>
                <textarea
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={4}
                  placeholder="Add any additional notes..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleCreateCustomer}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Create Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}