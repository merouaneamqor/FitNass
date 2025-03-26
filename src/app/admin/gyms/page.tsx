'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiEdit, FiTrash2, FiPlus, FiFilter, FiAlertTriangle, FiEye, FiHome } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import EditGymModal from './components/EditGymModal';
import type { Gym, UpdateData } from './types';

export default function GymsPage() {
  const { data: session, status } = useSession();
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGym, setEditingGym] = useState<Partial<Gym> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  
  useEffect(() => {
    // Only fetch data if user is authenticated as admin
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchGyms();
    } else if (status !== 'loading') {
      setLoading(false);
    }
  }, [status, session]);
  
  const fetchGyms = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/gyms', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch gyms: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setGyms(data);
      
      // Extract unique cities for filtering
      const uniqueCities = Array.from(new Set(data.map((gym: Gym) => gym.city))).sort();
      setCities(uniqueCities as string[]);
    } catch (err) {
      console.error('Error fetching gyms:', err);
      setError('Failed to load gyms. Please try again or contact support.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveGym = async (gym: UpdateData) => {
    try {
      const url = `/api/admin/gyms/${gym.id}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gym),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update gym: ${response.status} ${response.statusText}`);
      }
      
      // Refresh gym list to get latest data
      await fetchGyms();
      
    } catch (err) {
      console.error(`Error updating gym:`, err);
      throw err;
    }
  };
  
  const handleDeleteGym = async (gymId: string) => {
    if (confirm('Are you sure you want to delete this gym? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/gyms/${gymId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`Failed to delete gym: ${response.status} ${response.statusText}`);
        }
        
        // Remove gym from local state to avoid refetching
        setGyms(gyms.filter(gym => gym.id !== gymId));
        
      } catch (err) {
        console.error('Error deleting gym:', err);
        alert('Failed to delete gym. Please try again.');
      }
    }
  };
  
  const handleVerifyGym = async (gymId: string, isVerified: boolean) => {
    try {
      const response = await fetch(`/api/admin/gyms/${gymId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isVerified }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update gym verification: ${response.status} ${response.statusText}`);
      }
      
      // Update gym in local state
      setGyms(gyms.map(gym => 
        gym.id === gymId ? {...gym, isVerified} : gym
      ));
      
    } catch (err) {
      console.error('Error updating gym verification:', err);
      alert('Failed to update gym verification. Please try again.');
    }
  };
  
  const handleStatusChange = async (gymId: string, newStatus: Gym['status']) => {
    try {
      const response = await fetch(`/api/admin/gyms/${gymId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update gym status: ${response.status} ${response.statusText}`);
      }
      
      // Update gym in local state
      setGyms(gyms.map(gym => 
        gym.id === gymId ? {...gym, status: newStatus} : gym
      ));
      
    } catch (err) {
      console.error('Error updating gym status:', err);
      alert('Failed to update gym status. Please try again.');
    }
  };
  
  const handleEditGym = (gym: Gym) => {
    setEditingGym({...gym});
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGym(null);
  };
  
  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-neutral-600">Loading gyms...</p>
        </div>
      </div>
    );
  }
  
  if (!session || session.user.role !== 'ADMIN') {
    return <div className="flex justify-center items-center h-full">Access denied. Admin privileges required.</div>;
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen p-6 bg-neutral-50">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <FiAlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Error</h2>
          <p className="text-neutral-600 mb-6">{error}</p>
          <button 
            onClick={fetchGyms}
            className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  const filteredGyms = gyms.filter(gym => {
    const matchesSearch = gym.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          gym.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (gym.owner?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === '' || gym.status === selectedStatus;
    const matchesCity = selectedCity === '' || gym.city === selectedCity;
    
    return matchesSearch && matchesStatus && matchesCity;
  });
  
  // Function to get facility chip styling (optional, currently unused)
  // const getFacilityChip = (facility: string) => {
  //   return 'px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs whitespace-nowrap';
  // };
  
  // Function to get status badge (optional, currently unused)
  // const getStatusBadge = (status: string) => {
  //   switch (status) {
  //     case 'ACTIVE':
  //       return 'bg-green-100 text-green-800';
  //     case 'PENDING':
  //       return 'bg-yellow-100 text-yellow-800';
  //     case 'INACTIVE':
  //       return 'bg-red-100 text-red-800';
  //     default:
  //       return 'bg-gray-100 text-gray-800';
  //   }
  // };
  
  return (
    <div>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gym Management</h1>
        <Link 
          href="/admin/gyms/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FiPlus className="mr-2" />
          Add Gym
        </Link>
      </header>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, address, or owner"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiFilter className="text-gray-400" />
                  </div>
                  <select
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="PENDING_APPROVAL">Pending Approval</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiFilter className="text-gray-400" />
                  </div>
                  <select
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                  >
                    <option value="">All Cities</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <button 
              onClick={fetchGyms}
              className="inline-flex items-center justify-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>
          
          {gyms.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No gyms found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gym</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredGyms.map((gym) => (
                    <tr key={gym.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            {gym.images && gym.images.length > 0 ? (
                              <Image 
                                src={gym.images[0]} 
                                alt={gym.name}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <FiHome className="text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{gym.name}</div>
                            <div className="text-gray-500 text-sm">{gym.owner?.name || 'No owner'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{gym.city}</div>
                        <div className="text-xs text-gray-500">{gym.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {gym.rating.toFixed(1)} ⭐
                        </div>
                        <div className="text-xs text-gray-500">{gym.priceRange}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className={`text-sm border rounded px-2 py-1`}
                          value={gym.status}
                          onChange={(e) => handleStatusChange(gym.id, e.target.value as Gym['status'])}
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                          <option value="PENDING_APPROVAL">Pending Approval</option>
                          <option value="CLOSED">Closed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={gym.isVerified}
                            onChange={(e) => handleVerifyGym(gym.id, e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-500">
                            {gym.isVerified ? 'Verified' : 'Not verified'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {gym.viewCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-2">
                          <Link
                            href={`/gyms/${gym.id}`}
                            target="_blank"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FiEye className="h-5 w-5" />
                          </Link>
                          <button 
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => handleEditGym(gym)}
                          >
                            <FiEdit className="h-5 w-5" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDeleteGym(gym.id)}
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Edit Gym Modal */}
      {editingGym && (
        <EditGymModal
          gym={editingGym}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveGym}
        />
      )}
    </div>
  );
} 