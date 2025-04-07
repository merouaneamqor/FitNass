"use client";

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Calendar, MapPin, Clock, Users } from 'lucide-react';

// Define reservation type
interface Reservation {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  sportField: {
    id: string;
    name: string;
    type: string;
    price: number;
  };
  club: {
    id: string;
    name: string;
    address: string;
    city: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function PaymentSuccessPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await fetch(`/api/reservations/${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch reservation details');
        }
        const data = await response.json();
        setReservation(data);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchReservation();
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg">Processing your payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>We encountered a problem processing your payment</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/reservations">Back to Reservations</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="container mx-auto py-12">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive">Reservation Not Found</CardTitle>
            <CardDescription>We couldn&apos;t find details for this reservation</CardDescription>
          </CardHeader>
          <CardContent>
            <p>The reservation you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/reservations">Back to Reservations</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Format dates
  const startDate = new Date(reservation.startTime).toLocaleDateString();
  const startTime = new Date(reservation.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endTime = new Date(reservation.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center bg-primary text-primary-foreground rounded-t-lg pb-6">
          <div className="mx-auto mb-4">
            <CheckCircle2 className="h-16 w-16 text-white" />
          </div>
          <CardTitle className="text-3xl">Payment Successful!</CardTitle>
          <CardDescription className="text-primary-foreground/90 text-lg">Thank you for your reservation</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center mb-2 sm:mb-0">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              <span>{startDate}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              <span>{startTime} - {endTime}</span>
            </div>
          </div>
          
          <div className="border-b pb-4">
            <h3 className="font-medium text-lg mb-2">Reservation Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Sport Field</p>
                <p className="font-medium">{reservation.sportField?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium">{reservation.sportField?.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-primary" />
                  <p className="font-medium">{reservation.sportField?.club?.name}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Participants</p>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-primary" />
                  <p className="font-medium">{reservation.participantCount || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-2">Payment Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="font-medium text-2xl text-primary">{reservation.totalPrice} MAD</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="inline-flex items-center bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Paid
                </p>
              </div>
            </div>
          </div>
          <p className="text-gray-600">We&apos;ve sent a confirmation email with all the details.</p>
          <p className="text-gray-600">You&apos;ll receive a reminder 24 hours before your reservation. Don&apos;t forget to check your email and arrive on time. We can&apos;t wait to see you!</p>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href={`/reservations/${id}`}>View Reservation Details</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/reservations">My Reservations</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 