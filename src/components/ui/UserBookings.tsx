import React from 'react';
import { UserProfile } from '@/types/user';
import { FiCalendar, FiClock, FiXCircle } from 'react-icons/fi';
import Link from 'next/link';

// Define booking interface based on how it's used
interface Booking {
  id: string;
  gymId: string;
  gymName: string;
  date: string;
  time: string;
  className?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface UserBookingsProps {
  profile: UserProfile;
  onCancelBooking?: (bookingId: string) => Promise<void>;
  className?: string;
}

export const UserBookings: React.FC<UserBookingsProps> = ({
  profile,
  onCancelBooking,
  className = "",
}) => {
  const bookings = profile.bookings || [];
  
  // Sort bookings by date, with upcoming bookings first
  const sortedBookings = [...bookings].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Separate upcoming and past bookings
  const now = new Date();
  const upcomingBookings = sortedBookings.filter(booking => 
    booking.status === 'upcoming' || 
    new Date(`${booking.date}T${booking.time}`) > now
  );
  const pastBookings = sortedBookings.filter(booking => 
    booking.status === 'completed' || booking.status === 'cancelled' || 
    new Date(`${booking.date}T${booking.time}`) <= now
  );

  if (bookings.length === 0) {
    return (
      <div className={`bg-white border border-neutral-200 rounded-xl p-6 text-center ${className}`}>
        <FiCalendar className="mx-auto text-neutral-300 h-12 w-12 mb-4" />
        <h3 className="text-lg font-medium text-neutral-700">No Bookings Found</h3>
        <p className="text-neutral-500 mt-2">
          You haven&apos;t booked any gym sessions yet.
        </p>
        <Link 
          href="/gyms" 
          className="inline-block mt-4 px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors"
        >
          Find Gyms
        </Link>
      </div>
    );
  }

  const renderBookingsList = (bookings: Booking[], isPast = false) => {
    if (bookings.length === 0) return null;
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-neutral-800 mb-4">
          {isPast ? 'Past Bookings' : 'Upcoming Bookings'}
        </h3>
        
        {bookings.map((booking: Booking) => {
          const bookingDate = new Date(booking.date);
          const formattedDate = bookingDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
          });
          
          return (
            <div 
              key={booking.id} 
              className={`border rounded-xl p-4 ${
                isPast 
                  ? 'border-neutral-200 bg-neutral-50' 
                  : booking.status === 'cancelled'
                    ? 'border-rose-100 bg-rose-50'
                    : 'border-indigo-100 bg-indigo-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <Link href={`/gyms/${booking.gymId}`} className="group">
                  <h4 className="font-medium text-neutral-800 group-hover:text-indigo-600 transition-colors">
                    {booking.gymName}
                  </h4>
                </Link>
                
                {!isPast && booking.status !== 'cancelled' && onCancelBooking && (
                  <button
                    onClick={() => onCancelBooking(booking.id)}
                    className="text-neutral-500 hover:text-rose-500 transition-colors p-1"
                    aria-label="Cancel booking"
                  >
                    <FiXCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <div className="mt-3 space-y-2">
                <div className="flex items-center text-neutral-600">
                  <FiCalendar className="w-4 h-4 mr-2" />
                  <span>{formattedDate}</span>
                </div>
                
                <div className="flex items-center text-neutral-600">
                  <FiClock className="w-4 h-4 mr-2" />
                  <span>{booking.time}</span>
                </div>
                
                {booking.className && (
                  <div className="flex items-center text-neutral-600">
                    <span className="ml-6 text-sm">{booking.className}</span>
                  </div>
                )}
              </div>
              
              {booking.status === 'cancelled' && (
                <div className="mt-3 pt-3 border-t border-neutral-200">
                  <p className="text-rose-600 text-sm font-medium">Cancelled</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`${className}`}>
      {renderBookingsList(upcomingBookings)}
      
      {upcomingBookings.length > 0 && pastBookings.length > 0 && (
        <div className="my-8 border-t border-neutral-200" />
      )}
      
      {renderBookingsList(pastBookings, true)}
    </div>
  );
};

export default UserBookings; 