'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FiUsers, FiPlus, FiFilter, FiMail, FiPhone, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { PageHeader, Card, Button, Search, DataTable, Modal } from '@/components/dashboard';

// Define the Client interface at the top
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: string;
  fitnessGoals: string;
  trainer: string;
}

// Define the column type that matches the DataTable component
type Column = {
  header: string;
  accessor: keyof Client | ((item: Client) => React.ReactNode);
  cell?: (row: Client) => JSX.Element;
  className?: string;
};

// Mock data for client list
const mockClients: Client[] = [
  {
    id: '1',
    name: 'Mohammed El Alami',
    email: 'mohammed@example.com',
    phone: '+212 612-345-678',
    joinDate: '2023-10-15',
    status: 'Active',
    fitnessGoals: 'Weight loss',
    trainer: 'Sarah Johnson'
  },
  {
    id: '2',
    name: 'Fatima Zahra',
    email: 'fatima@example.com',
    phone: '+212 687-654-321',
    joinDate: '2023-08-22',
    status: 'Active',
    fitnessGoals: 'Muscle gain',
    trainer: 'Ahmed Hassan'
  },
  {
    id: '3',
    name: 'Youssef Benali',
    email: 'youssef@example.com',
    phone: '+212 661-234-567',
    joinDate: '2024-01-05',
    status: 'Inactive',
    fitnessGoals: 'General fitness',
    trainer: 'Laila Tazi'
  },
  {
    id: '4',
    name: 'Amina Mansouri',
    email: 'amina@example.com',
    phone: '+212 678-123-456',
    joinDate: '2023-11-18',
    status: 'Active',
    fitnessGoals: 'Flexibility',
    trainer: 'Sarah Johnson'
  },
  {
    id: '5',
    name: 'Karim Berrada',
    email: 'karim@example.com',
    phone: '+212 623-456-789',
    joinDate: '2023-09-30',
    status: 'Active',
    fitnessGoals: 'Strength training',
    trainer: 'Ahmed Hassan'
  }
];

export default function ClientsPage() {
  const { data: session } = useSession();
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

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

  // Define columns for DataTable
  const columns: Column[] = [
    {
      header: 'Name',
      accessor: 'name',
      cell: (row: Client) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
            <FiUsers className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{row.name}</div>
            <div className="text-sm text-gray-500">Since {new Date(row.joinDate).toLocaleDateString()}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Contact',
      accessor: 'email',
      cell: (row: Client) => (
        <div className="flex flex-col">
          <div className="text-sm text-gray-900 flex items-center">
            <FiMail className="mr-2 text-gray-400" />
            {row.email}
          </div>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <FiPhone className="mr-2 text-gray-400" />
            {row.phone}
          </div>
        </div>
      )
    },
    {
      header: 'Fitness Goals',
      accessor: 'fitnessGoals',
    },
    {
      header: 'Trainer',
      accessor: 'trainer',
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row: Client) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          row.status === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: (row) => row.id,
      cell: (row: Client) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            icon={FiEdit2}
            onClick={() => handleEditClient(row)}
            className="mr-2"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={FiTrash2}
            onClick={() => handleDeleteClient(row.id)}
            className="text-red-600 hover:text-red-900"
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.fitnessGoals.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.trainer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = () => {
    setIsAddModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter(client => client.id !== id));
  };

  const handleSubmitNewClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newClient: Client = {
      id: `client-${Date.now()}`,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      fitnessGoals: formData.get('fitnessGoals') as string,
      trainer: formData.get('trainer') as string
    };
    
    setClients([...clients, newClient]);
    setIsAddModalOpen(false);
  };

  const handleUpdateClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedClient) return;
    
    const formData = new FormData(e.currentTarget);
    
    const updatedClient: Client = {
      ...selectedClient,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      status: formData.get('status') as string,
      fitnessGoals: formData.get('fitnessGoals') as string,
      trainer: formData.get('trainer') as string
    };
    
    setClients(clients.map(client => 
      client.id === selectedClient.id ? updatedClient : client
    ));
    
    setIsEditModalOpen(false);
    setSelectedClient(null);
  };

  const headerActions = (
    <Button icon={FiPlus} onClick={handleAddClient}>
      Add New Client
    </Button>
  );

  const addModalFooter = (
    <div className="flex justify-end space-x-3">
      <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
        Cancel
      </Button>
      <Button type="submit" form="add-client-form">
        Add Client
      </Button>
    </div>
  );

  const editModalFooter = (
    <div className="flex justify-end space-x-3">
      <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
        Cancel
      </Button>
      <Button type="submit" form="edit-client-form">
        Update Client
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        description="Manage your gym clients and track their fitness journey."
        icon={FiUsers}
        actions={headerActions}
      />

      <div className="flex justify-between items-center mb-6">
        <Search
          onSearch={setSearchTerm}
          placeholder="Search clients..."
          initialValue={searchTerm}
          className="w-full sm:w-64"
        />
        
        <Button
          variant="outline"
          icon={FiFilter}
          className="ml-2"
        >
          Filter
        </Button>
      </div>

      <Card noPadding>
        <DataTable
          data={filteredClients}
          columns={columns}
          keyField="id"
          emptyMessage="No clients found"
          onRowClick={handleEditClient}
        />
      </Card>

      {/* Add Client Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Client"
        footer={addModalFooter}
      >
        <form id="add-client-form" className="space-y-4" onSubmit={handleSubmitNewClient}>
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
            <label className="block text-sm font-medium text-gray-700">Fitness Goals</label>
            <input
              type="text"
              name="fitnessGoals"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Trainer</label>
            <select
              name="trainer"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="Sarah Johnson">Sarah Johnson</option>
              <option value="Ahmed Hassan">Ahmed Hassan</option>
              <option value="Laila Tazi">Laila Tazi</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Edit Client Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedClient(null);
        }}
        title="Edit Client"
        footer={editModalFooter}
      >
        {selectedClient && (
          <form id="edit-client-form" className="space-y-4" onSubmit={handleUpdateClient}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={selectedClient.name}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={selectedClient.email}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={selectedClient.phone}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={selectedClient.status}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Fitness Goals</label>
              <input
                type="text"
                name="fitnessGoals"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={selectedClient.fitnessGoals}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Trainer</label>
              <select
                name="trainer"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={selectedClient.trainer}
                required
              >
                <option value="Sarah Johnson">Sarah Johnson</option>
                <option value="Ahmed Hassan">Ahmed Hassan</option>
                <option value="Laila Tazi">Laila Tazi</option>
              </select>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
} 