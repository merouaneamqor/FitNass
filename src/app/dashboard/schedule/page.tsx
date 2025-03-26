'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FiPlus, FiEdit2, FiTrash2, FiCalendar, FiUser, FiUsers, FiMapPin } from 'react-icons/fi';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg, DateSelectArg } from '@fullcalendar/core';
import { PageHeader, Card, Button, Modal } from '@/components/dashboard';

// Define interface for class type
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

// Interface for calendar events
interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: {
    instructor: string;
    location: string;
    maxCapacity: number;
    currentEnrollment: number;
  };
}

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

// Days of the week mapping (for converting day name to date)
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function SchedulePage() {
  const { data: session } = useSession();
  const [classes, setClasses] = useState<ClassType[]>(mockClasses);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState<ClassType | null>(null);
  const [viewMode, setViewMode] = useState('timeGridWeek');
  const calendarRef = useRef<FullCalendar>(null);

  // Convert classes to calendar events
  useEffect(() => {
    const events = classes.map(classItem => {
      // Get the current week's date for the day
      const date = getDateForDayOfWeek(classItem.day);
      
      // Create the start and end datetime strings
      const startDateTime = `${date}T${classItem.startTime}:00`;
      const endDateTime = `${date}T${classItem.endTime}:00`;
      
      return {
        id: classItem.id,
        title: classItem.title,
        start: startDateTime,
        end: endDateTime,
        backgroundColor: classItem.color,
        borderColor: classItem.color,
        textColor: '#FFFFFF',
        extendedProps: {
          instructor: classItem.instructor,
          location: classItem.location,
          maxCapacity: classItem.maxCapacity,
          currentEnrollment: classItem.currentEnrollment
        }
      };
    });
    
    setCalendarEvents(events);
  }, [classes]);

  // Helper function to get current week's date for a day name
  const getDateForDayOfWeek = (dayName: string) => {
    const today = new Date();
    const currentDayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const targetDayIndex = daysOfWeek.indexOf(dayName);
    
    const diff = targetDayIndex - currentDayIndex;
    
    // Calculate the date of the target day in this week
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);
    
    // Format as YYYY-MM-DD
    return targetDate.toISOString().split('T')[0];
  };

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

  const handleEventClick = (info: EventClickArg) => {
    const eventId = info.event.id;
    const classItem = classes.find(c => c.id === eventId);
    if (classItem) {
      handleEditClass(classItem);
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    // Create a new class when a time slot is selected
    const startTime = new Date(selectInfo.start);
    const endTime = new Date(selectInfo.end);
    
    // Format times as HH:MM
    const formattedStartTime = `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`;
    const formattedEndTime = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
    
    // Get the day name
    const dayName = daysOfWeek[startTime.getDay()];
    
    // Create a new class template
    const newClass: ClassType = {
      id: `new-${Date.now()}`,
      title: 'New Class',
      instructor: '',
      day: dayName,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      maxCapacity: 15,
      currentEnrollment: 0,
      location: '',
      color: '#3B82F6' // Default blue color
    };
    
    setCurrentClass(newClass);
    setIsModalOpen(true);
  };

  const handleDeleteClass = (classId: string) => {
    // In a real app, you'd make an API call to delete the class
    setClasses(classes.filter(c => c.id !== classId));
  };

  const handleSubmitClass = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const instructor = formData.get('instructor') as string;
    const day = formData.get('day') as string;
    const startTime = formData.get('startTime') as string;
    const endTime = formData.get('endTime') as string;
    const location = formData.get('location') as string;
    const maxCapacity = parseInt(formData.get('maxCapacity') as string);
    const color = formData.get('color') as string;
    
    if (currentClass) {
      // Editing existing class
      if (currentClass.id.startsWith('new-')) {
        // It's a new class that hasn't been saved yet
        const newClass: ClassType = {
          id: `class-${Date.now()}`,
          title,
          instructor,
          day,
          startTime,
          endTime,
          maxCapacity,
          currentEnrollment: 0,
          location,
          color
        };
        
        setClasses([...classes, newClass]);
      } else {
        // Update existing class
        setClasses(classes.map(c => 
          c.id === currentClass.id 
            ? { 
                ...c, 
                title,
                instructor,
                day,
                startTime,
                endTime,
                maxCapacity,
                location,
                color
              } 
            : c
        ));
      }
    }
    
    setIsModalOpen(false);
    setCurrentClass(null);
  };

  const getEnrollmentStatus = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  interface EventContentProps {
    event: {
      title: string;
      extendedProps: {
        instructor: string;
        location: string;
      };
    };
  }

  const renderEventContent = (eventInfo: EventContentProps) => {
    const { event } = eventInfo;
    const { instructor, location } = event.extendedProps;
    
    return (
      <div className="p-1 overflow-hidden h-full">
        <div className="font-semibold text-sm">{event.title}</div>
        <div className="text-xs flex items-center">
          <FiUser className="mr-1" size={10} />
          {instructor}
        </div>
        <div className="text-xs flex items-center">
          <FiMapPin className="mr-1" size={10} />
          {location}
        </div>
      </div>
    );
  };

  const headerActions = (
    <>
      <Button
        variant={viewMode === 'timeGridWeek' ? 'primary' : 'outline'}
        onClick={() => setViewMode('timeGridWeek')}
        size="sm"
      >
        Week View
      </Button>
      <Button
        variant={viewMode === 'dayGridMonth' ? 'primary' : 'outline'}
        onClick={() => setViewMode('dayGridMonth')}
        size="sm"
      >
        Month View
      </Button>
      <Button icon={FiPlus} onClick={handleAddClass}>
        Add Class
      </Button>
    </>
  );

  const modalFooter = (
    <div className="flex justify-end space-x-3">
      <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
        Cancel
      </Button>
      <Button type="submit" form="class-form">
        {currentClass && !currentClass.id.startsWith('new-') ? 'Update Class' : 'Create Class'}
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedule"
        description="Manage your gym's classes and sessions."
        icon={FiCalendar}
        actions={headerActions}
      />

      <Card noPadding>
        <div className="p-4">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={viewMode}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridDay,timeGridWeek,dayGridMonth'
            }}
            events={calendarEvents}
            eventContent={renderEventContent}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            height="auto"
            aspectRatio={1.8}
            expandRows={true}
            allDaySlot={false}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            eventClick={handleEventClick}
            select={handleDateSelect}
            slotDuration="00:30:00"
            slotLabelFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short'
            }}
            eventTimeFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short'
            }}
          />
        </div>
      </Card>

      <Card title="All Classes">
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
              {classes.sort((a, b) => 
                daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day) || 
                a.startTime.localeCompare(b.startTime)
              ).map((classItem) => (
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
                      {classItem.day}, {classItem.startTime} - {classItem.endTime}
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
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={FiEdit2}
                      onClick={() => handleEditClass(classItem)}
                      className="mr-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={FiTrash2}
                      onClick={() => handleDeleteClass(classItem.id)}
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
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentClass && !currentClass.id.startsWith('new-') ? 'Edit Class' : 'Add New Class'}
        footer={modalFooter}
      >
        <form id="class-form" className="space-y-4" onSubmit={handleSubmitClass}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Class Title</label>
            <input
              type="text"
              name="title"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue={currentClass?.title || ''}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Instructor</label>
            <input
              type="text"
              name="instructor"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue={currentClass?.instructor || ''}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Day</label>
            <select
              name="day"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue={currentClass?.day || 'Monday'}
              required
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
                name="startTime"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={currentClass?.startTime || '09:00'}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="time"
                name="endTime"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={currentClass?.endTime || '10:00'}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={currentClass?.location || ''}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Capacity</label>
              <input
                type="number"
                name="maxCapacity"
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={currentClass?.maxCapacity || '15'}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Color</label>
            <input
              type="color"
              name="color"
              className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue={currentClass?.color || '#3B82F6'}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
} 