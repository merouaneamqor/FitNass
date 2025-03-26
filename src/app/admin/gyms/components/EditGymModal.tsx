import { useState, useEffect } from 'react';
import { FiX, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import type { User, Gym, UpdateData } from '../types';

interface EditGymModalProps {
  gym: Partial<Gym>;
  isOpen: boolean;
  onClose: () => void;
  onSave: (gym: UpdateData) => Promise<void>;
}

export default function EditGymModal({ gym, isOpen, onClose, onSave }: EditGymModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gymOwners, setGymOwners] = useState<User[]>([]);
  const [formData, setFormData] = useState<Partial<Gym>>(gym);
  const [newFacility, setNewFacility] = useState('');
  const [newImage, setNewImage] = useState('');

  // Fetch gym owners when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchGymOwners();
      setFormData(gym);
    }
  }, [isOpen, gym]);

  const fetchGymOwners = async () => {
    try {
      const response = await fetch('/api/admin/users?role=GYM_OWNER');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch gym owners: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setGymOwners(data);
    } catch (err) {
      console.error('Error fetching gym owners:', err);
      setError('Failed to load gym owners. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const addFacility = () => {
    if (newFacility.trim() && formData.facilities) {
      setFormData(prev => ({
        ...prev,
        facilities: [...(prev.facilities || []), newFacility.trim()]
      }));
      setNewFacility('');
    }
  };

  const removeFacility = (index: number) => {
    if (formData.facilities) {
      setFormData(prev => ({
        ...prev,
        facilities: prev.facilities!.filter((_, i) => i !== index)
      }));
    }
  };

  const addImage = () => {
    if (newImage.trim() && formData.images) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), newImage.trim()]
      }));
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    if (formData.images) {
      setFormData(prev => ({
        ...prev,
        images: prev.images!.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updateData: UpdateData = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        latitude: formData.latitude,
        longitude: formData.longitude,
        phone: formData.phone,
        website: formData.website,
        email: formData.email,
        priceRange: formData.priceRange,
        facilities: formData.facilities,
        images: formData.images,
        isVerified: formData.isVerified,
      };
      
      // Only include owner if ownerId is provided
      if (formData.ownerId) {
        updateData.owner = { connect: { id: formData.ownerId } };
      }

      await onSave(updateData);
      onClose();
    } catch (err: unknown) {
      console.error('Error saving gym:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save gym. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Edit Gym</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg mx-6 mt-4 p-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Gym Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700 mb-1">
                    Owner <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="ownerId"
                    name="ownerId"
                    required
                    value={formData.ownerId || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an owner</option>
                    {gymOwners.map(owner => (
                      <option key={owner.id} value={owner.id}>
                        {owner.name || owner.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Gym Details */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Gym Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <select
                    id="priceRange"
                    name="priceRange"
                    value={formData.priceRange || '$'}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="$">$ (Budget)</option>
                    <option value="$$">$$ (Moderate)</option>
                    <option value="$$$">$$$ (Premium)</option>
                    <option value="$$$$">$$$$ (Luxury)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status || 'ACTIVE'}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="PENDING_APPROVAL">Pending Approval</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Facilities</h3>
              <div className="mb-3">
                <div className="flex">
                  <input
                    type="text"
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    placeholder="Add facility (e.g., Swimming Pool, Yoga Studio)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addFacility}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.facilities?.map((facility, index) => (
                  <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    <span>{facility}</span>
                    <button
                      type="button"
                      onClick={() => removeFacility(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
                {(!formData.facilities || formData.facilities.length === 0) && (
                  <p className="text-gray-500 text-sm">No facilities added yet.</p>
                )}
              </div>
            </div>

            {/* Images */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Images</h3>
              <div className="mb-3">
                <div className="flex">
                  <input
                    type="url"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="Add image URL"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {formData.images?.map((image, index) => (
                  <div key={index} className="relative group">
                    <img src={image} alt={`Gym ${index + 1}`} className="h-24 w-full object-cover rounded-md" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
                {(!formData.images || formData.images.length === 0) && (
                  <p className="text-gray-500 text-sm">No images added yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 border-t pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2 h-5 w-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export type { UpdateData }; 