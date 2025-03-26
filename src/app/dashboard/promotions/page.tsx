'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FiPlus, FiCalendar, FiTag, FiPercent, FiEdit, FiTrash2, FiAlertCircle, FiSearch } from 'react-icons/fi';

// Define interface for promotion
interface Promotion {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  discount: string;
  status: 'active' | 'scheduled' | 'expired' | 'cancelled';
  redemptionCount: number;
}

// Mock promotions - will be replaced with real API data
const mockPromotions: Promotion[] = [
  {
    id: '1',
    title: 'Ramadan Special',
    description: 'Profitez de notre offre spéciale Ramadan et transformez votre routine fitness.',
    startDate: '2024-03-01',
    endDate: '2024-04-10',
    discount: '30%',
    status: 'active',
    redemptionCount: 42
  },
  {
    id: '2',
    title: 'Summer Deal',
    description: 'Préparez votre silhouette d\'été avec cette offre limitée.',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    discount: '25%',
    status: 'scheduled',
    redemptionCount: 0
  },
  {
    id: '3',
    title: 'Parrainage',
    description: 'Invitez vos proches et bénéficiez tous les deux d\'avantages exclusifs.',
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    discount: '1 Month Free',
    status: 'active',
    redemptionCount: 15
  },
  {
    id: '4',
    title: 'Pack Family',
    description: 'Venez vous entraîner en famille et économisez sur les abonnements.',
    startDate: '2024-02-01',
    endDate: '2024-05-31',
    discount: '50% on second membership',
    status: 'active',
    redemptionCount: 23
  },
  {
    id: '5',
    title: 'Tarif Étudiant',
    description: 'Sur présentation de votre carte d\'étudiant, accédez à des tarifs réduits.',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    discount: '20%',
    status: 'active',
    redemptionCount: 67
  }
];

export default function PromotionsPage() {
  const { data: session } = useSession();
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState<Promotion | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Filter promotions based on search term and status
  const filteredPromotions = promotions.filter(promo => {
    const matchesSearch = 
      promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || promo.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (!session || session.user.role !== 'GYM_OWNER') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need to be a gym owner to access this page.</p>
        </div>
      </div>
    );
  }

  const handleNewPromotion = () => {
    setCurrentPromotion(null);
    setIsModalOpen(true);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setCurrentPromotion(promotion);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Promotions</h1>
        <p className="text-gray-600 mt-2">Create and manage special offers for your gym.</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="mb-4 text-sm font-medium text-gray-700">
          <FiAlertCircle className="inline-block mr-2 text-yellow-500" />
          Les promotions actives apparaîtront sur votre page publique et seront visibles par tous les visiteurs.
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search promotions..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <button
              onClick={handleNewPromotion}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <FiPlus className="mr-2" />
              New Promotion
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredPromotions.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promotion</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Redemptions</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPromotions.map((promotion) => (
                  <tr key={promotion.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FiTag className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{promotion.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{promotion.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <FiCalendar className="mr-2 text-gray-400" />
                        {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm font-medium text-blue-600">
                        <FiPercent className="mr-2" />
                        {promotion.discount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(promotion.status)}`}>
                        {promotion.status.charAt(0).toUpperCase() + promotion.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {promotion.redemptionCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEditPromotion(promotion)} 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <FiEdit className="inline mr-1" /> Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <FiTrash2 className="inline mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No promotions found. Create your first promotion!</p>
            </div>
          )}
        </div>
      </div>

      {/* Promotion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {currentPromotion ? 'Edit Promotion' : 'New Promotion'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue={currentPromotion?.title || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  defaultValue={currentPromotion?.description || ''}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    defaultValue={currentPromotion?.startDate || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    defaultValue={currentPromotion?.endDate || ''}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Discount</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g. 30%, 3 months for 2, etc."
                  defaultValue={currentPromotion?.discount || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue={currentPromotion?.status || 'active'}
                >
                  <option value="active">Active</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {currentPromotion ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 