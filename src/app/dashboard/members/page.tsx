'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FiMail, FiPhone, FiUser, FiCalendar, FiUserPlus, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import { PageHeader, Card, Button, Modal, Search } from '@/components/dashboard';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: string;
  membershipType: string;
  lastVisit: string;
}

export default function MembersPage() {
  const { data: session } = useSession();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (session?.user?.role === 'GYM_OWNER') {
      fetchMembers();
    }
  }, [session]);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/members');
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
      const data = await response.json();
      // Ensure data is an array before setting it
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to load members. Please try again later.');
      setMembers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Filter members based on search term
  const filteredMembers = Array.isArray(members) ? members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.membershipType.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

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

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleAddMember = () => {
    setIsAddModalOpen(true);
  };

  const handleSubmitNewMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newMember = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      membershipType: formData.get('membershipType') as string,
    };
    
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMember),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add member');
      }
      
      // Refresh the members list
      await fetchMembers();
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Error adding member:', err);
      alert('Failed to add member. Please try again.');
    }
  };

  const deleteMember = async (id: string) => {
    try {
      const response = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete member');
      }
      
      // Refresh the members list
      await fetchMembers();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error deleting member:', err);
      alert('Failed to delete member. Please try again.');
    }
  };

  const headerActions = (
    <Button icon={FiUserPlus} onClick={handleAddMember}>
      Add New Member
    </Button>
  );

  const memberDetailModalFooter = (
    <div className="flex justify-end space-x-3">
      <Button variant="danger" icon={FiTrash2} onClick={() => selectedMember && deleteMember(selectedMember.id)}>
        Delete Member
      </Button>
      <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
        Close
      </Button>
    </div>
  );

  const addMemberModalFooter = (
    <div className="flex justify-end space-x-3">
      <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
        Cancel
      </Button>
      <Button type="submit" form="add-member-form">
        Add Member
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Members"
        description="Manage your gym membership."
        icon={FiUsers}
        actions={headerActions}
      />

      <div className="flex mb-6">
        <Search
          onSearch={setSearchTerm}
          placeholder="Search members..."
          initialValue={searchTerm}
          className="w-full sm:w-64"
        />
      </div>

      {loading ? (
        <Card>
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Loading members...</p>
          </div>
        </Card>
      ) : error ? (
        <Card>
          <div className="flex justify-center items-center h-40">
            <p className="text-red-500">{error}</p>
          </div>
        </Card>
      ) : (
        <Card noPadding>
          {members.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No members found. Add your first member to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membership</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <tr 
                      key={member.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleMemberClick(member)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FiUser className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-500">Since {new Date(member.joinDate).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm text-gray-900 flex items-center">
                            <FiMail className="mr-2 text-gray-400" />
                            {member.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <FiPhone className="mr-2 text-gray-400" />
                            {member.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          member.membershipType === 'Premium' 
                            ? 'bg-purple-100 text-purple-800' 
                            : member.membershipType === 'Standard'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {member.membershipType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          member.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <FiCalendar className="mr-2 text-gray-400" />
                          {new Date(member.lastVisit).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={FiEdit2}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMemberClick(member);
                          }}
                          className="mr-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={FiTrash2}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMember(member.id);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Member Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedMember?.name || "Member Details"}
        footer={memberDetailModalFooter}
      >
        {selectedMember && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{selectedMember.email}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{selectedMember.phone}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Membership</p>
              <p className="font-medium">{selectedMember.membershipType}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Join Date</p>
              <p className="font-medium">{new Date(selectedMember.joinDate).toLocaleDateString()}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Last Visit</p>
              <p className="font-medium">{new Date(selectedMember.lastVisit).toLocaleDateString()}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className={`font-medium ${
                selectedMember.status === 'active' ? 'text-green-600' : 'text-red-600'
              }`}>
                {selectedMember.status.charAt(0).toUpperCase() + selectedMember.status.slice(1)}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Member"
        footer={addMemberModalFooter}
      >
        <form id="add-member-form" className="space-y-4" onSubmit={handleSubmitNewMember}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Membership Type</label>
            <select
              name="membershipType"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="Premium">Premium</option>
              <option value="Standard">Standard</option>
              <option value="Basic">Basic</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
} 