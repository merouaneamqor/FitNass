'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FiPlus, FiEdit2, FiTrash2, FiCalendar, FiClock, FiUser, FiUsers } from 'react-icons/fi';

// Mock data for classes/sessions
const mockClasses = [
  {
    id: '1',
    title: 'Yoga Flow',
    instructor: 'Sara Mansouri',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    maxCapacity: 15,
    currentEnrollment: 10,
    location: 'Studio A',
    color: '#10B981'
  },
  {
    id: '2',
    title: 'HIIT Workout',
    instructor: 'Karim Hassan',
    day: 'Monday',
    startTime: '18:00',
    endTime: '19:00',
    maxCapacity: 20,
    currentEnrollment: 18,
    location: 'Main Floor',
    color: '#EF4444'
  },
  {
    id: '3',
    title: 'Spinning',
    instructor: 'Youssef Tazi',
    day: 'Tuesday',
    startTime: '18:30',
    endTime: '19:30',
    maxCapacity: 12,
    currentEnrollment: 8,
    location: 'Cycling Room',
    color: '#F59E0B'
  },
  {
    id: '4',
    title: 'Pilates',
    instructor: 'Nadia Alaoui',
    day: 'Wednesday',
    startTime: '10:00',
    endTime: '11:00',
    maxCapacity: 15,
    currentEnrollment: 7,
    location: 'Studio B',
    color: '#8B5CF6'
  },
  {
    id: '5',
    title: 'Boxing',
    instructor: 'Mohammed Idrissi',
    day: 'Wednesday',
    startTime: '19:00',
    endTime: '20:15',
    maxCapacity: 16,
    currentEnrollment: 14,
    location: 'Boxing Area',
    color: '#3B82F6'
  },
  {
    id: '6',
    title: 'Zumba',
    instructor: 'Leila Benjelloun',
    day: 'Thursday',
    startTime: '18:00',
    endTime: '19:00',
    maxCapacity: 25,
    currentEnrollment: 20,
    location: 'Studio A',
    color: '#EC4899'
  },
  {
    id: '7',
    title: 'CrossFit',
    instructor: 'Karim Hassan',
    day: 'Friday',
    startTime: '17:30',
    endTime: '18:45',
    maxCapacity: 15,
    currentEnrollment: 15,
    location: 'CrossFit Area',
    color: '#F97316'
  },
  {
    id: '8',
    title: 'Meditation',
    instructor: 'Sara Mansouri',
    day: 'Saturday',
    startTime: '09:00',
    endTime: '10:00',
    maxCapacity: 20,
    currentEnrollment: 12,
    location: 'Studio B',
    color: '#06B6D4'
  }
];

// Days of the week
const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

// Time slots for the schedule
const timeSlots = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

// Add this interface at the top of the file
interface ClassType {
  id: string;
  title: string;
  instructor: string;
  day: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  currentEnrollment: number;
  location: string;
  color: string;
}

export default function SchedulePage() {
  const { data: session } = useSession();
  const [classes, setClasses] = useState(mockClasses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState<ClassType | null>(null);
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'list'

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

  const handleAddClass = () => {
    setCurrentClass(null);
    setIsModalOpen(true);
  };

  const handleEditClass = (classItem: ClassType) => {
    setCurrentClass(classItem);
    setIsModalOpen(true);
  };

  const formatTimeRange = (start: string, end: string) => {
    return `${start} - ${end}`;
  };

  const getEnrollmentStatus = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  // Render class block for weekly view
  const renderClassBlock = (classItem: ClassType) => {
    const startHour = parseInt(classItem.startTime.split(':')[0]);
    const startPosition = (startHour - 7) * 60; // 7:00 AM is the first time slot
    const startMinute = parseInt(classItem.startTime.split(':')[1] || '0');
    
    const endHour = parseInt(classItem.endTime.split(':')[0]);
    const endMinute = parseInt(classItem.endTime.split(':')[1] || '0');
    
    const durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    
    return (
      <div 
        key={classItem.id}
        style={{
          top: `${startPosition + startMinute}px`,
          height: `${durationMinutes}px`,
          backgroundColor: classItem.color,
        }}
        className="absolute inset-x-2 rounded p-1 text-white text-xs overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => handleEditClass(classItem)}
      >
        <div className="font-semibold">{classItem.title}</div>
        <div className="text-xs">{formatTimeRange(classItem.startTime, classItem.endTime)}</div>
        <div className="text-xs truncate">{classItem.instructor}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-600 mt-2">Manage your gym's classes and sessions.</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <button
            className={`px-4 py-2 rounded-lg ${viewMode === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setViewMode('week')}
          >
            Week View
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setViewMode('list')}
          >
            List View
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            onClick={handleAddClass}
          >
            <FiPlus className="mr-2" />
            Add Class
          </button>
        </div>
      </div>

      {viewMode === 'week' ? (
        // Weekly calendar view
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-8 border-b">
            <div className="p-4 text-sm font-medium text-gray-500 border-r">Time</div>
            {daysOfWeek.map((day) => (
              <div key={day} className="p-4 text-sm font-medium text-gray-700 text-center">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-8 h-[700px] relative">
            <div className="border-r">
              {timeSlots.map((time) => (
                <div key={time} className="h-[60px] border-b flex items-center justify-center">
                  <span className="text-xs text-gray-500">{time}</span>
                </div>
              ))}
            </div>
            
            {daysOfWeek.map((day) => (
              <div key={day} className="border-r relative">
                {classes
                  .filter(c => c.day === day)
                  .map(classItem => renderClassBlock(classItem))
                }
              </div>
            ))}
          </div>
        </div>
      ) : (
        // List view
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classes.sort((a, b) => daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day) || a.startTime.localeCompare(b.startTime)).map((classItem) => (
                  <tr key={classItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full" style={{ backgroundColor: classItem.color }}></div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{classItem.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <FiCalendar className="mr-2 text-gray-400" />
                        {classItem.day}, {formatTimeRange(classItem.startTime, classItem.endTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <FiUser className="mr-2 text-gray-400" />
                        {classItem.instructor}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {classItem.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiUsers className="mr-2 text-gray-400" />
                        <span className={`text-sm font-medium ${getEnrollmentStatus(classItem.currentEnrollment, classItem.maxCapacity)}`}>
                          {classItem.currentEnrollment}/{classItem.maxCapacity}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div 
                          className={`h-1.5 rounded-full ${
                            classItem.currentEnrollment / classItem.maxCapacity >= 0.9 
                              ? 'bg-red-500' 
                              : classItem.currentEnrollment / classItem.maxCapacity >= 0.7 
                              ? 'bg-yellow-500' 
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${(classItem.currentEnrollment / classItem.maxCapacity) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEditClass(classItem)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <FiEdit2 className="inline mr-1" /> Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <FiTrash2 className="inline mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {currentClass ? 'Edit Class' : 'Add New Class'}
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
                <label className="block text-sm font-medium text-gray-700">Class Title</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue={currentClass?.title || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Instructor</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue={currentClass?.instructor || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Day</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue={currentClass?.day || 'Monday'}
                >
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Time</label>
                  <input
                    type="time"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    defaultValue={currentClass?.startTime || '09:00'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Time</label>
                  <input
                    type="time"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    defaultValue={currentClass?.endTime || '10:00'}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    defaultValue={currentClass?.location || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Capacity</label>
                  <input
                    type="number"
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    defaultValue={currentClass?.maxCapacity || '15'}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Color</label>
                <input
                  type="color"
                  className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue={currentClass?.color || '#3B82F6'}
                />
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
                  {currentClass ? 'Update Class' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 