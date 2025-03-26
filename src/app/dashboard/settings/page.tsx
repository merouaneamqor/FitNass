'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FiSave, FiUpload, FiTrash2, FiUser, FiMapPin, FiPhone, FiMail, FiGlobe, FiLock, FiCreditCard } from 'react-icons/fi';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Mock data for gym profile
  const [gymProfile, setGymProfile] = useState({
    name: 'FitZone Casablanca',
    description: 'Modern fitness center offering a wide range of equipment and classes for all fitness levels.',
    address: '123 Boulevard Mohammed V',
    city: 'Casablanca',
    state: 'Casablanca-Settat',
    zipCode: '20250',
    email: 'contact@fitzone.ma',
    phone: '+212 522 123 456',
    website: 'https://fitzone.ma',
    openingHours: [
      { day: 'Monday', open: '06:00', close: '22:00' },
      { day: 'Tuesday', open: '06:00', close: '22:00' },
      { day: 'Wednesday', open: '06:00', close: '22:00' },
      { day: 'Thursday', open: '06:00', close: '22:00' },
      { day: 'Friday', open: '06:00', close: '22:00' },
      { day: 'Saturday', open: '08:00', close: '20:00' },
      { day: 'Sunday', open: '08:00', close: '18:00' }
    ],
    facilities: ['WiFi', 'Parking', 'Showers', 'Lockers', 'Towel Service', 'Sauna'],
    paymentMethods: ['Credit Card', 'Cash', 'Bank Transfer', 'Mobile Payment'],
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f'
    ]
  });
  
  // Mock data for account settings
  const [accountSettings, setAccountSettings] = useState({
    name: 'Ahmed Bensouda',
    email: 'ahmed@fitzone.ma',
    password: '••••••••••',
    notifications: {
      email: true,
      sms: false,
      app: true,
      newMembers: true,
      reviews: true,
      promotions: false
    }
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

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your gym profile and account settings.</p>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-4 px-6 ${activeTab === 'profile' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-500'}`}
        >
          Gym Profile
        </button>
        <button
          onClick={() => setActiveTab('account')}
          className={`pb-4 px-6 ${activeTab === 'account' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-500'}`}
        >
          Account Settings
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`pb-4 px-6 ${activeTab === 'billing' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-500'}`}
        >
          Billing & Subscription
        </button>
      </div>
      
      {/* Gym Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg shadow p-6">
          <form className="space-y-6">
            {/* Gym Images */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Gym Images</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {gymProfile.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={image} 
                      alt={`Gym image ${index + 1}`} 
                      className="h-48 w-full object-cover rounded-lg" 
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                      <button type="button" className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer">
                  <FiUpload className="text-2xl mb-2" />
                  <div>Upload Image</div>
                </div>
              </div>
            </div>
            
            {/* Basic Info */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gym Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={gymProfile.name}
                      onChange={(e) => setGymProfile({...gymProfile, name: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={gymProfile.description}
                    onChange={(e) => setGymProfile({...gymProfile, description: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMapPin className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={gymProfile.address}
                      onChange={(e) => setGymProfile({...gymProfile, address: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={gymProfile.city}
                    onChange={(e) => setGymProfile({...gymProfile, city: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                  <input
                    type="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={gymProfile.state}
                    onChange={(e) => setGymProfile({...gymProfile, state: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={gymProfile.zipCode}
                    onChange={(e) => setGymProfile({...gymProfile, zipCode: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={gymProfile.phone}
                      onChange={(e) => setGymProfile({...gymProfile, phone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={gymProfile.email}
                      onChange={(e) => setGymProfile({...gymProfile, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiGlobe className="text-gray-400" />
                    </div>
                    <input
                      type="url"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={gymProfile.website}
                      onChange={(e) => setGymProfile({...gymProfile, website: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Opening Hours */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Opening Hours</h2>
              <div className="space-y-3">
                {gymProfile.openingHours.map((hours, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 items-center">
                    <div className="text-gray-700 font-medium">
                      {hours.day}
                    </div>
                    <div className="col-span-2 flex space-x-3 items-center">
                      <div className="flex-grow flex space-x-3">
                        <input
                          type="time"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={hours.open}
                          onChange={(e) => {
                            const updatedHours = [...gymProfile.openingHours];
                            updatedHours[index].open = e.target.value;
                            setGymProfile({...gymProfile, openingHours: updatedHours});
                          }}
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={hours.close}
                          onChange={(e) => {
                            const updatedHours = [...gymProfile.openingHours];
                            updatedHours[index].close = e.target.value;
                            setGymProfile({...gymProfile, openingHours: updatedHours});
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Facilities & Amenities */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Facilities & Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {['WiFi', 'Parking', 'Showers', 'Lockers', 'Towel Service', 'Sauna', 'Steam Room', 'Swimming Pool', 'Child Care', 'Cafe', 'Juice Bar', 'Personal Trainers', 'Group Classes'].map((facility) => (
                  <div key={facility} className="flex items-center">
                    <input
                      id={`facility-${facility}`}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={gymProfile.facilities.includes(facility)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setGymProfile({
                            ...gymProfile,
                            facilities: [...gymProfile.facilities, facility]
                          });
                        } else {
                          setGymProfile({
                            ...gymProfile,
                            facilities: gymProfile.facilities.filter(f => f !== facility)
                          });
                        }
                      }}
                    />
                    <label htmlFor={`facility-${facility}`} className="ml-2 block text-sm text-gray-700">
                      {facility}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Payment Methods */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'Mobile Payment', 'PayPal'].map((method) => (
                  <div key={method} className="flex items-center">
                    <input
                      id={`payment-${method}`}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={gymProfile.paymentMethods.includes(method)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setGymProfile({
                            ...gymProfile,
                            paymentMethods: [...gymProfile.paymentMethods, method]
                          });
                        } else {
                          setGymProfile({
                            ...gymProfile,
                            paymentMethods: gymProfile.paymentMethods.filter(m => m !== method)
                          });
                        }
                      }}
                    />
                    <label htmlFor={`payment-${method}`} className="ml-2 block text-sm text-gray-700">
                      {method}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end border-t pt-6">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiSave className="mr-2" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Account Settings Tab */}
      {activeTab === 'account' && (
        <div className="bg-white rounded-lg shadow p-6">
          <form className="space-y-6">
            {/* Profile Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={accountSettings.name}
                      onChange={(e) => setAccountSettings({...accountSettings, name: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={accountSettings.email}
                      onChange={(e) => setAccountSettings({...accountSettings, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Password */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Password</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your current password"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Notification Settings */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
              
              <div className="space-y-4">
                <h3 className="text-base font-medium text-gray-700">Notification Channels</h3>
                <div className="space-y-2">
                  {[
                    { id: 'email', label: 'Email Notifications' },
                    { id: 'sms', label: 'SMS Notifications' },
                    { id: 'app', label: 'In-App Notifications' }
                  ].map((channel) => (
                    <div key={channel.id} className="flex items-center">
                      <input
                        id={`channel-${channel.id}`}
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={accountSettings.notifications[channel.id as keyof typeof accountSettings.notifications]}
                        onChange={(e) => {
                          setAccountSettings({
                            ...accountSettings,
                            notifications: {
                              ...accountSettings.notifications,
                              [channel.id as keyof typeof accountSettings.notifications]: e.target.checked
                            }
                          });
                        }}
                      />
                      <label htmlFor={`channel-${channel.id}`} className="ml-2 block text-sm text-gray-700">
                        {channel.label}
                      </label>
                    </div>
                  ))}
                </div>
                
                <h3 className="text-base font-medium text-gray-700 mt-4">Notification Types</h3>
                <div className="space-y-2">
                  {[
                    { id: 'newMembers', label: 'New Member Registrations' },
                    { id: 'reviews', label: 'New Reviews' },
                    { id: 'promotions', label: 'Promotion Updates' }
                  ].map((type) => (
                    <div key={type.id} className="flex items-center">
                      <input
                        id={`type-${type.id}`}
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={accountSettings.notifications[type.id as keyof typeof accountSettings.notifications]}
                        onChange={(e) => {
                          setAccountSettings({
                            ...accountSettings,
                            notifications: {
                              ...accountSettings.notifications,
                              [type.id as keyof typeof accountSettings.notifications]: e.target.checked
                            }
                          });
                        }}
                      />
                      <label htmlFor={`type-${type.id}`} className="ml-2 block text-sm text-gray-700">
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end border-t pt-6">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiSave className="mr-2" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-blue-800">Premium Plan</h3>
                  <p className="text-blue-600">Your subscription renews on December 15, 2023</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border-r border-blue-200 pr-4">
                  <div className="text-sm text-blue-600">Monthly Price</div>
                  <div className="text-2xl font-bold text-blue-800">499 MAD</div>
                </div>
                <div className="md:border-r md:border-blue-200 md:pr-4">
                  <div className="text-sm text-blue-600">Next Billing</div>
                  <div className="text-2xl font-bold text-blue-800">499 MAD</div>
                </div>
                <div>
                  <button className="mt-2 text-blue-600 hover:text-blue-800 font-medium">
                    Change Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <div className="h-12 w-12 flex items-center justify-center bg-gray-100 rounded-md">
                  <FiCreditCard className="text-2xl text-gray-600" />
                </div>
                <div className="ml-4">
                  <div className="font-medium">Visa ending in 4242</div>
                  <div className="text-sm text-gray-500">Expires 12/2024</div>
                </div>
              </div>
              <div>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  Update
                </button>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Billing History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { date: 'Nov 15, 2023', description: 'Premium Plan - Monthly', amount: '499 MAD', status: 'Paid' },
                    { date: 'Oct 15, 2023', description: 'Premium Plan - Monthly', amount: '499 MAD', status: 'Paid' },
                    { date: 'Sep 15, 2023', description: 'Premium Plan - Monthly', amount: '499 MAD', status: 'Paid' },
                    { date: 'Aug 15, 2023', description: 'Premium Plan - Monthly', amount: '499 MAD', status: 'Paid' },
                    { date: 'Jul 15, 2023', description: 'Premium Plan - Monthly', amount: '499 MAD', status: 'Paid' }
                  ].map((invoice, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" className="text-blue-600 hover:text-blue-800">
                          Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4 text-red-600">Cancel Subscription</h2>
            <p className="text-gray-600 mb-4">
              Canceling your subscription will disable premium features at the end of your current billing period. You can resubscribe at any time.
            </p>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-red-600 text-base font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FiTrash2 className="mr-2" />
              Cancel Subscription
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 