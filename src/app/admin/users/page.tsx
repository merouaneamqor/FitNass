'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiEdit, FiTrash2, FiUserPlus, FiX, FiCheck, FiFilter, FiAlertTriangle } from 'react-icons/fi';
import { useSession } from 'next-auth/react';

// Define User interface
interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'GYM_OWNER' | 'ADMIN';
  status: 'active' | 'inactive' | 'pending';
  joined: string;
  password?: string; // Optional password field for new user creation
}

export default function UsersPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Only fetch data if user is authenticated as admin
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchUsers();
    } else if (status !== 'loading') {
      setLoading(false);
    }
  }, [status, session]);
  
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again or contact support.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveUser = async (user: User, isNewUser: boolean) => {
    try {
      const url = isNewUser ? '/api/admin/users' : `/api/admin/users/${user.id}`;
      const method = isNewUser ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${isNewUser ? 'create' : 'update'} user: ${response.status} ${response.statusText}`);
      }
      
      // Refresh user list to get latest data
      await fetchUsers();
      
    } catch (err) {
      console.error(`Error ${isNewUser ? 'creating' : 'updating'} user:`, err);
      alert(`Failed to ${isNewUser ? 'create' : 'update'} user. Please try again.`);
    }
  };
  
  const handleDeleteUserAPI = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.status} ${response.statusText}`);
      }
      
      // Remove user from local state to avoid refetching
      setUsers(users.filter(user => user.id !== userId));
      
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user. Please try again.');
    }
  };
  
  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-neutral-600">Loading users...</p>
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
            onClick={fetchUsers}
            className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === '' || user.role === selectedRole;
    const matchesStatus = selectedStatus === '' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  const handleEditUser = (user: User) => {
    setEditingUser({...user});
    setIsModalOpen(true);
  };
  
  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      handleDeleteUserAPI(userId);
    }
  };
  
  const handleRoleChange = (userId: string, newRole: User['role']) => {
    setUsers(users.map(user => 
      user.id === userId ? {...user, role: newRole} : user
    ));
    
    // Find the user and update on the server
    const user = users.find(u => u.id === userId);
    if (user) {
      handleSaveUser({...user, role: newRole}, false);
    }
  };
  
  const handleStatusChange = (userId: string, newStatus: User['status']) => {
    setUsers(users.map(user => 
      user.id === userId ? {...user, status: newStatus} : user
    ));
    
    // Find the user and update on the server
    const user = users.find(u => u.id === userId);
    if (user) {
      handleSaveUser({...user, status: newStatus}, false);
    }
  };
  
  return (
    <div>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          onClick={() => {
            setEditingUser({
              id: '',  // Will be set by the server
              name: '',
              email: '',
              role: 'USER',
              status: 'pending',
              joined: new Date().toISOString().split('T')[0]
            });
            setIsModalOpen(true);
          }}
        >
          <FiUserPlus className="mr-2" />
          Add User
        </button>
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
                  placeholder="Search users by name or email"
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
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="">All Roles</option>
                    <option value="USER">User</option>
                    <option value="GYM_OWNER">Gym Owner</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>
            
            <button 
              onClick={fetchUsers}
              className="inline-flex items-center justify-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>
          
          {users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as User['role'])}
                        >
                          <option value="USER">User</option>
                          <option value="GYM_OWNER">Gym Owner</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className={`text-sm border rounded px-2 py-1 ${
                            user.status === 'active' ? 'border-green-300 text-green-800 bg-green-50' :
                            user.status === 'inactive' ? 'border-red-300 text-red-800 bg-red-50' :
                            'border-yellow-300 text-yellow-800 bg-yellow-50'
                          }`}
                          value={user.status}
                          onChange={(e) => handleStatusChange(user.id, e.target.value as User['status'])}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {new Date(user.joined).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-2">
                          <button 
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => handleEditUser(user)}
                          >
                            <FiEdit className="h-5 w-5" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDeleteUser(user.id)}
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
      
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {editingUser.id ? 'Edit User' : 'Add User'}
              </h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value as User['role']})}
                >
                  <option value="USER">User</option>
                  <option value="GYM_OWNER">Gym Owner</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editingUser.status}
                  onChange={(e) => setEditingUser({...editingUser, status: e.target.value as User['status']})}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              {!editingUser.id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input 
                    type="password" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Set initial password"
                    id="password"
                  />
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 flex items-center"
                  onClick={() => {
                    const isNewUser = !editingUser.id;
                    
                    // For new users, get the password from the input field
                    let userData = {...editingUser};
                    if (isNewUser) {
                      const passwordInput = document.getElementById('password') as HTMLInputElement;
                      if (passwordInput && passwordInput.value) {
                        userData = {...userData, password: passwordInput.value};
                      } else {
                        alert('Please enter a password for the new user');
                        return;
                      }
                    }
                    
                    handleSaveUser(userData, isNewUser);
                    setIsModalOpen(false);
                  }}
                >
                  <FiCheck className="mr-2" />
                  {editingUser.id ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 