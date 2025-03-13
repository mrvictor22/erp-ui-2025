import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Mail, 
  Eye, 
  XCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  Ban,
  X
} from 'lucide-react';
import { format } from 'date-fns';

interface Invoice {
  id: string;
  number: string;
  type: 'invoice' | 'fiscal_credit';
  customer: string;
  date: string;
  dueDate: string;
  total: number;
  status: 'draft' | 'issued' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Customer {
  id: string;
  name: string;
  taxId: string;
  address: string;
  email: string;
}

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: 'INV001',
    number: 'F001-00001',
    type: 'invoice',
    customer: 'Acme Corporation',
    date: '2024-03-10',
    dueDate: '2024-04-10',
    total: 2500.00,
    status: 'paid',
    items: [
      {
        id: '1',
        description: 'IT Consulting Services',
        quantity: 40,
        unitPrice: 50.00,
        total: 2000.00
      },
      {
        id: '2',
        description: 'Software Licenses',
        quantity: 5,
        unitPrice: 100.00,
        total: 500.00
      }
    ]
  },
  {
    id: 'INV002',
    number: 'F001-00002',
    type: 'fiscal_credit',
    customer: 'Tech Solutions Inc',
    date: '2024-03-09',
    dueDate: '2024-04-09',
    total: 1800.00,
    status: 'issued',
    items: [
      {
        id: '1',
        description: 'Cloud Storage Services',
        quantity: 1,
        unitPrice: 1800.00,
        total: 1800.00
      }
    ]
  }
];

const mockCustomers: Customer[] = [
  {
    id: 'C001',
    name: 'Acme Corporation',
    taxId: '12345678901',
    address: '123 Business Ave, Suite 100',
    email: 'billing@acme.com'
  },
  {
    id: 'C002',
    name: 'Tech Solutions Inc',
    taxId: '98765432109',
    address: '456 Tech Park, Floor 15',
    email: 'accounts@techsolutions.com'
  }
];

export function BillingModule() {
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'issued':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-500';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'issued':
        return <Clock className="w-4 h-4" />;
      case 'draft':
        return <FileText className="w-4 h-4" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <Ban className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewModalOpen(true);
  };

  const handleCancelInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsCancelModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Billing Management</h1>
        <button
          onClick={() => setIsNewInvoiceModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Invoice
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex gap-4 bg-white p-4 rounded-lg shadow">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search invoices..."
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
              <p className="text-sm text-gray-500">Total Invoices</p>
              <p className="text-2xl font-bold mt-1">254</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <FileText className="w-6 h-6 text-primary-600" />
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
              <p className="text-sm text-gray-500">Pending Payment</p>
              <p className="text-2xl font-bold mt-1">$12,580</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-red-500 text-sm">+5.2%</span>
              <span className="text-gray-500 text-sm ml-2">from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Paid Invoices</p>
              <p className="text-2xl font-bold mt-1">185</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-500 text-sm">+8.1%</span>
              <span className="text-gray-500 text-sm ml-2">from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-2xl font-bold mt-1">12</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-red-500 text-sm">-2.3%</span>
              <span className="text-gray-500 text-sm ml-2">from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
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
            {mockInvoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {invoice.number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {invoice.type === 'invoice' ? 'Invoice' : 'Fiscal Credit'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {invoice.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(invoice.date), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${invoice.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                    {getStatusIcon(invoice.status)}
                    <span className="ml-1 capitalize">{invoice.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewInvoice(invoice)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Print Invoice"
                    >
                      <Printer className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Send Email"
                    >
                      <Mail className="w-5 h-5 text-gray-600" />
                    </button>
                    {invoice.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelInvoice(invoice)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Cancel Invoice"
                      >
                        <XCircle className="w-5 h-5 text-red-600" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Invoice Modal */}
      {isViewModalOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Invoice Details</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Invoice Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Number:</span> {selectedInvoice.number}</p>
                  <p><span className="font-medium">Type:</span> {selectedInvoice.type === 'invoice' ? 'Invoice' : 'Fiscal Credit'}</p>
                  <p><span className="font-medium">Date:</span> {format(new Date(selectedInvoice.date), 'MMM dd, yyyy')}</p>
                  <p><span className="font-medium">Due Date:</span> {format(new Date(selectedInvoice.dueDate), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Customer Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedInvoice.customer}</p>
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedInvoice.status)}`}>
                      {getStatusIcon(selectedInvoice.status)}
                      <span className="ml-1 capitalize">{selectedInvoice.status}</span>
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Items</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedInvoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">Total:</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${selectedInvoice.total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Invoice Modal */}
      {isCancelModalOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Cancel Invoice</h2>
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600">
                Are you sure you want to cancel invoice <span className="font-medium">{selectedInvoice.number}</span>?
                This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                No, Keep It
              </button>
              <button
                onClick={() => {
                  // Handle invoice cancellation
                  setIsCancelModalOpen(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Yes, Cancel Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}