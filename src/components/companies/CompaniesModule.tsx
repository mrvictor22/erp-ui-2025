import React, { useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  Plus,
  Eye,
  Mail,
  Phone,
  MapPin,
  BarChart3,
  Users,
  Package,
  FileText,
  Truck,
  Store,
  X,
  Edit,
  Trash2,
  Save,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign
} from 'lucide-react';
import { format } from 'date-fns';
import { useCompanies } from '../../hooks/useCompanies';
import { useCompanyModules } from '../../hooks/useCompanyModules';
import { useCompanyMetrics } from '../../hooks/useCompanyMetrics';
import type { Database } from '../../lib/database.types';

type Company = Database['public']['Tables']['companies']['Row'];
type CompanyInsert = Database['public']['Tables']['companies']['Insert'];
type CompanyUpdate = Database['public']['Tables']['companies']['Update'];

export function CompaniesModule() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [newCompanyData, setNewCompanyData] = useState<Partial<CompanyInsert>>({
    status: 'active',
    type: 'headquarters'
  });
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  const { companies, isLoading, createCompany, updateCompany } = useCompanies();
  const { modules, createModule } = useCompanyModules(selectedCompany?.id || '');
  const { metrics, metricsHistory } = useCompanyMetrics(selectedCompany?.id || '');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMetricTrend = (value: number) => {
    if (value > 0) {
      return { color: 'text-green-500', icon: <CheckCircle2 className="w-4 h-4" /> };
    } else if (value < 0) {
      return { color: 'text-red-500', icon: <AlertTriangle className="w-4 h-4" /> };
    }
    return { color: 'text-gray-500', icon: <Clock className="w-4 h-4" /> };
  };

  const handleCreateCompany = async () => {
    try {
      const company = await createCompany.mutateAsync(newCompanyData as CompanyInsert);
      
      // Create selected modules
      for (const moduleName of selectedModules) {
        await createModule.mutateAsync({
          company_id: company.id,
          module_name: moduleName as any,
          is_enabled: true
        });
      }

      setIsNewCompanyModalOpen(false);
      setNewCompanyData({
        status: 'active',
        type: 'headquarters'
      });
      setSelectedModules([]);
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };

  const handleUpdateCompany = async (updates: CompanyUpdate) => {
    if (!selectedCompany) return;
    try {
      await updateCompany.mutateAsync({
        id: selectedCompany.id,
        ...updates
      });
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

  const filteredCompanies = companies?.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustries.length === 0 || 
                           selectedIndustries.includes(company.industry);
    return matchesSearch && matchesIndustry;
  }) || [];

  const allIndustries = Array.from(new Set(companies?.map(company => company.industry) || []));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Company Management</h1>
        <button
          onClick={() => setIsNewCompanyModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Company
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Companies</p>
              <p className="text-2xl font-bold mt-1">{companies?.length || 0}</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <Building2 className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-500 text-sm">Active</span>
              <span className="text-gray-500 text-sm ml-2">
                {companies?.filter(c => c.status === 'active').length || 0} companies
              </span>
            </div>
          </div>
        </div>

        {/* Add more statistics cards here */}
      </div>

      {/* Filters and Search */}
      <div className="flex gap-4 bg-white p-4 rounded-lg shadow">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {allIndustries.map(industry => (
            <button
              key={industry}
              onClick={() => {
                setSelectedIndustries(current =>
                  current.includes(industry)
                    ? current.filter(i => i !== industry)
                    : [...current, industry]
                );
              }}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedIndustries.includes(industry)
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Industry
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
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
            {filteredCompanies.map((company) => (
              <tr key={company.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {company.logo_url ? (
                        <img
                          src={company.logo_url}
                          alt={company.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-700 font-medium text-lg">
                            {company.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{company.name}</div>
                      <div className="text-sm text-gray-500">Tax ID: {company.tax_id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{company.email}</div>
                  <div className="text-sm text-gray-500">{company.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {company.industry}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="capitalize">{company.type}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(company.status)}`}>
                    {company.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => {
                      setSelectedCompany(company);
                      setIsCompanyModalOpen(true);
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

      {/* Company Details Modal */}
      {isCompanyModalOpen && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal content */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                {selectedCompany.logo_url ? (
                  <img
                    src={selectedCompany.logo_url}
                    alt={selectedCompany.name}
                    className="h-12 w-12 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                    <span className="text-primary-700 font-medium text-lg">
                      {selectedCompany.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold">{selectedCompany.name}</h2>
                  <p className="text-sm text-gray-500">
                    Founded {format(new Date(selectedCompany.founded_date), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCompanyModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Add modal content here */}
          </div>
        </div>
      )}

      {/* New Company Modal */}
      {isNewCompanyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">New Company</h2>
              <button
                onClick={() => setIsNewCompanyModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Add new company form here */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={newCompanyData.name || ''}
                      onChange={(e) => setNewCompanyData({ ...newCompanyData, name: e.target.value })}
                      className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter company name"
                    />
                  </div>
                  {/* Add more form fields */}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsNewCompanyModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCompany}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Create Company
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}