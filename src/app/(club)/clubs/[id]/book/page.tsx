"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from '@/components/ui/select';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

type SportField = {
  id: string;
  name: string;
  description: string;
  type: string;
  pricePerHour: string;
  surface?: string;
  indoor: boolean;
};

type Reservation = {
  id: string;
  startTime: string;
  endTime: string;
  sportFieldId: string;
};

export default function BookClub() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const [club, setClub] = useState<any>(null);
  const [sportFields, setSportFields] = useState<SportField[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedField, setSelectedField] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [participants, setParticipants] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch club data
  useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await fetch(`/api/clubs/${id}`);
        if (!response.ok) throw new Error('Failed to fetch club');
        const data = await response.json();
        setClub(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load club details',
          variant: 'destructive',
        });
      }
    };
    
    fetchClub();
  }, [id, toast]);

  // Fetch sport fields
  useEffect(() => {
    const fetchSportFields = async () => {
      try {
        const response = await fetch(`/api/clubs/${id}/sport-fields`);
        if (!response.ok) throw new Error('Failed to fetch sport fields');
        const data = await response.json();
        setSportFields(data.sportFields);
        
        if (data.sportFields.length > 0) {
          setSelectedField(data.sportFields[0].id);
        }
        
        setIsLoading(false);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load sport fields',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchSportFields();
    }
  }, [id, toast]);

  // Fetch reservations when a field is selected
  useEffect(() => {
    const fetchReservations = async () => {
      if (!selectedField) return;
      
      try {
        // Fetch existing reservations for this field to show on calendar
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7); // One week ago
        
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30); // 30 days in the future
        
        const response = await fetch(`/api/clubs/${id}/sport-fields/${selectedField}/reservations?start=${startDate.toISOString()}&end=${endDate.toISOString()}`);
        if (!response.ok) throw new Error('Failed to fetch reservations');
        
        const data = await response.json();
        setReservations(data.reservations);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load reservations',
          variant: 'destructive',
        });
      }
    };
    
    fetchReservations();
  }, [id, selectedField, toast]);

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.date);
    
    // Set default times (current hour rounded up to nearest hour)
    const currentHour = new Date().getHours();
    const nextHour = currentHour + 1;
    
    setStartTime(`${nextHour.toString().padStart(2, '0')}:00`);
    setEndTime(`${(nextHour + 1).toString().padStart(2, '0')}:00`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedField || !selectedDate || !startTime || !endTime) {
      toast({
        title: 'Missing information',
        description: 'Please select a field, date, and time',
        variant: 'destructive',
      });
      return;
    }
    
    // Create the start and end date objects
    const startDateStr = format(selectedDate, 'yyyy-MM-dd');
    const endDateStr = format(selectedDate, 'yyyy-MM-dd');
    
    const startDateTime = new Date(`${startDateStr}T${startTime}:00`);
    const endDateTime = new Date(`${endDateStr}T${endTime}:00`);
    
    // Validate that end time is after start time
    if (endDateTime <= startDateTime) {
      toast({
        title: 'Invalid time selection',
        description: 'End time must be after start time',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sportFieldId: selectedField,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          participantCount: participants,
          notes,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create reservation');
      }
      
      const reservation = await response.json();
      
      toast({
        title: 'Success!',
        description: 'Your reservation has been created',
      });
      
      // Redirect to reservation page
      router.push(`/reservations/${reservation.id}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create reservation',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calendar events from reservations
  const calendarEvents = reservations.map(reservation => ({
    id: reservation.id,
    title: 'Reserved',
    start: reservation.startTime,
    end: reservation.endTime,
    backgroundColor: '#f43f5e',
    borderColor: '#f43f5e',
  }));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Book a Reservation</h1>
      
      {club && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">{club.name}</h2>
          <p className="text-muted-foreground">{club.address}, {club.city}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Select Date & Time</CardTitle>
            <CardDescription>Choose an available time slot for your reservation</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="calendar-container">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek'
                }}
                events={calendarEvents}
                dateClick={handleDateClick}
                height="auto"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Reservation Details</CardTitle>
            <CardDescription>Complete your booking information</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sport-field">Sport Field</Label>
                <Select 
                  value={selectedField} 
                  onValueChange={setSelectedField}
                  disabled={sportFields.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sport field" />
                  </SelectTrigger>
                  <SelectContent>
                    {sportFields.map(field => (
                      <SelectItem key={field.id} value={field.id}>
                        {field.name} - {field.type} {field.indoor ? '(Indoor)' : '(Outdoor)'} - {field.pricePerHour} MAD/hour
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Selected Date</Label>
                <Input 
                  id="date" 
                  value={selectedDate ? format(selectedDate, 'EEEE, MMMM do yyyy') : ''} 
                  readOnly 
                  placeholder="Click on the calendar to select a date"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input 
                    id="start-time" 
                    type="time" 
                    value={startTime} 
                    onChange={(e) => setStartTime(e.target.value)}
                    disabled={!selectedDate}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input 
                    id="end-time" 
                    type="time" 
                    value={endTime} 
                    onChange={(e) => setEndTime(e.target.value)}
                    disabled={!selectedDate}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="participants">Number of Participants</Label>
                <Input 
                  id="participants" 
                  type="number" 
                  min="1" 
                  value={participants} 
                  onChange={(e) => setParticipants(parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Any special requests or additional information" 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting || !selectedField || !selectedDate || !startTime || !endTime}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Reservation...
                  </>
                ) : (
                  'Book Now'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 