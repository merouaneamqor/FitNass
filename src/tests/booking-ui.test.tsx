import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookClub from '@/app/(club)/clubs/[id]/book/page';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

// Mock hooks and components
jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({ id: 'club-1' })),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

// Define interface for FullCalendar props
interface FullCalendarProps {
  events?: Array<{
    id: string;
    title: string;
    start: string | Date;
    end: string | Date;
    extendedProps?: Record<string, unknown>;
  }>;
  eventClick?: (info: { event: { id: string } }) => void;
  initialView?: string;
  headerToolbar?: {
    left?: string;
    center?: string;
    right?: string;
  };
  [key: string]: unknown;
}

jest.mock('@fullcalendar/react', () => ({
  __esModule: true,
  default: function MockFullCalendar(props: FullCalendarProps) {
    return (
      <div data-testid="mock-calendar">
        <button 
          onClick={() => props.eventClick?.({ event: { id: 'test-event' } })}
          data-testid="calendar-event"
        >
          Test Event
        </button>
      </div>
    );
  },
}));

// Mock fetch for API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

describe('BookClub Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock club data
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/api/clubs/club-1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            id: 'club-1',
            name: 'Test Club',
            address: '123 Main St',
            city: 'Casablanca',
          }),
        });
      } else if (url.includes('/api/clubs/club-1/sport-fields')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            sportFields: [
              {
                id: 'field-1',
                name: 'Tennis Court 1',
                type: 'TENNIS',
                indoor: false,
                pricePerHour: '200',
              },
              {
                id: 'field-2',
                name: 'Football Field',
                type: 'FOOTBALL',
                indoor: false,
                pricePerHour: '500',
              },
            ],
          }),
        });
      } else if (url.includes('/reservations')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            reservations: [
              {
                id: 'res-1',
                startTime: '2023-04-15T10:00:00Z',
                endTime: '2023-04-15T11:00:00Z',
              },
            ],
          }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });
  });

  it('should load club and sport field data', async () => {
    render(<BookClub />);
    
    // Should show a loading state initially
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Check club information is displayed
    await waitFor(() => {
      expect(screen.getByText('Test Club')).toBeInTheDocument();
      expect(screen.getByText('123 Main St, Casablanca')).toBeInTheDocument();
    });
    
    // Check sport fields are loaded
    await waitFor(() => {
      expect(screen.getByText(/Tennis Court 1/)).toBeInTheDocument();
      expect(screen.getByText(/Football Field/)).toBeInTheDocument();
    });
  });

  it('should handle date selection on calendar', async () => {
    render(<BookClub />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Click on a date in the calendar
    fireEvent.click(screen.getByTestId('calendar-date-btn'));
    
    // Check that the date is selected and time inputs are enabled
    await waitFor(() => {
      const startTimeInput = screen.getByLabelText(/Start Time/i);
      const endTimeInput = screen.getByLabelText(/End Time/i);
      
      expect(startTimeInput).toBeEnabled();
      expect(endTimeInput).toBeEnabled();
    });
  });

  it('should validate form before submission', async () => {
    const mockRouter = useRouter();
    const mockToast = toast;
    
    render(<BookClub />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Book button should be disabled initially
    expect(screen.getByText('Book Now')).toBeDisabled();
    
    // Select a sport field
    await waitFor(() => {
      expect(screen.getByText(/Tennis Court 1/)).toBeInTheDocument();
    });
    
    // Select a date on the calendar
    fireEvent.click(screen.getByTestId('calendar-date-btn'));
    
    // Set time values
    const startTimeInput = screen.getByLabelText(/Start Time/i);
    const endTimeInput = screen.getByLabelText(/End Time/i);
    
    fireEvent.change(startTimeInput, { target: { value: '10:00' } });
    fireEvent.change(endTimeInput, { target: { value: '09:00' } }); // Invalid: end before start
    
    // Try to submit the form
    const bookButton = screen.getByText('Book Now');
    expect(bookButton).not.toBeDisabled(); // It's enabled because we have field, date and times
    
    fireEvent.click(bookButton);
    
    // Should show error toast
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Invalid time selection',
        description: expect.stringContaining('End time must be after start time'),
        variant: 'destructive',
      });
    });
    
    // Fix the time
    fireEvent.change(endTimeInput, { target: { value: '11:00' } });
    
    // Set participants
    const participantsInput = screen.getByLabelText(/Number of Participants/i);
    fireEvent.change(participantsInput, { target: { value: '4' } });
    
    // Mock successful API response for reservation creation
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 'new-res-id' }),
      })
    );
    
    // Submit the form
    fireEvent.click(bookButton);
    
    // Should redirect to the reservation page
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/reservations/new-res-id');
    });
  });

  it('should handle API errors gracefully', async () => {
    const mockToast = toast;
    
    // Mock API error
    (global.fetch as jest.Mock).mockImplementationOnce((url: string) => {
      if (url.includes('/api/clubs/club-1')) {
        return Promise.reject(new Error('Failed to fetch club'));
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });
    
    render(<BookClub />);
    
    // Wait for error handling
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Failed to load club details',
        variant: 'destructive',
      });
    });
  });
}); 