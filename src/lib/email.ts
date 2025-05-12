import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

// Create a transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: Boolean(process.env.EMAIL_SERVER_SECURE) || false,
});

// Define interfaces for email template parameters
interface Reservation {
  id: string;
  startTime: string | Date;
  endTime: string | Date;
  status: string;
  price: number;
  participantCount?: number;
  totalPrice?: number;
  paymentStatus?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface SportField {
  id: string;
  name: string;
  type: string;
  price: number;
}

interface Club {
  id: string;
  name: string;
  address: string;
  city: string;
  zipCode?: string;
}

// Email templates
export const reservationConfirmationTemplate = (
  reservation: Reservation,
  user: User,
  sportField: SportField,
  club: Club
) => {
  const startTime = new Date(reservation.startTime).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
  
  const endTime = new Date(reservation.endTime).toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  return {
    subject: `Reservation Confirmation - ${club.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4a5568; text-align: center; margin-bottom: 30px;">Reservation Confirmation</h1>
        
        <div style="background-color: #f7fafc; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #2d3748; margin-top: 0;">${club.name}</h2>
          <p style="color: #4a5568; margin-bottom: 5px;">${club.address}</p>
          <p style="color: #4a5568; margin-bottom: 0;">${club.city}${club.zipCode ? `, ${club.zipCode}` : ''}</p>
        </div>
        
        <div style="background-color: #ebf4ff; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #2c5282; margin-top: 0;">Reservation Details</h2>
          <p style="color: #4a5568; margin-bottom: 5px;"><strong>Field:</strong> ${sportField.name} (${sportField.type})</p>
          <p style="color: #4a5568; margin-bottom: 5px;"><strong>Date & Time:</strong> ${startTime} - ${endTime}</p>
          <p style="color: #4a5568; margin-bottom: 5px;"><strong>Participants:</strong> ${reservation.participantCount || 'Not specified'}</p>
          <p style="color: #4a5568; margin-bottom: 0;"><strong>Reservation ID:</strong> ${reservation.id}</p>
        </div>
        
        <div style="background-color: #f0fff4; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #276749; margin-top: 0;">Payment Information</h2>
          <p style="color: #4a5568; margin-bottom: 5px;"><strong>Total Amount:</strong> ${reservation.totalPrice} MAD</p>
          <p style="color: #4a5568; margin-bottom: 0;"><strong>Payment Status:</strong> ${reservation.paymentStatus}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #4a5568; margin-bottom: 5px;">Thank you for your reservation!</p>
          <p style="color: #4a5568; margin-bottom: 0;">
            If you need to cancel or modify your reservation, please visit
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/reservations/${reservation.id}" style="color: #3182ce; text-decoration: none;">
              your reservation page
            </a>
            or contact us directly.
          </p>
        </div>
      </div>
    `,
    text: `
      Reservation Confirmation - ${club.name}
      
      Club: ${club.name}
      Address: ${club.address}, ${club.city}${club.zipCode ? `, ${club.zipCode}` : ''}
      
      Reservation Details:
      Field: ${sportField.name} (${sportField.type})
      Date & Time: ${startTime} - ${endTime}
      Participants: ${reservation.participantCount || 'Not specified'}
      Reservation ID: ${reservation.id}
      
      Payment Information:
      Total Amount: ${reservation.totalPrice} MAD
      Payment Status: ${reservation.paymentStatus}
      
      Thank you for your reservation!
      
      If you need to cancel or modify your reservation, please visit ${process.env.NEXT_PUBLIC_APP_URL}/reservations/${reservation.id} or contact us directly.
    `,
  };
};

// Send email
export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  text: string,
  from = process.env.EMAIL_FROM
) => {
  try {
    const result = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

// Send reservation confirmation email
export const sendReservationConfirmationEmail = async (
  reservationId: string
) => {
  try {
    // Fetch reservation with explicitly selected related data
    if (!prisma) throw new Error('Prisma client is not initialized');
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        status: true,
        totalPrice: true,
        participantCount: true,
        paymentStatus: true,
        user: { // Select specific user fields
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        sportField: { // Select specific sportField and nested place fields
          select: {
            id: true,
            name: true,
            type: true,
            pricePerHour: true,
            place: {
              select: {
                id: true,
                name: true,
                address: true,
                city: true,
                zipCode: true,
              }
            }
          }
        },
      },
    });

    // Check if essential data exists after fetching
    if (!reservation || !reservation.user || !reservation.sportField || !reservation.sportField.place) {
      // Log more specific error
      console.error(`Missing data for reservation ID: ${reservationId}. Found:`, {
        reservation: !!reservation,
        user: !!reservation?.user,
        sportField: !!reservation?.sportField,
        club: !!reservation?.sportField?.place,
      });
      throw new Error('Required data for reservation email not found');
    }

    // Directly map data now that types are enforced by Prisma select
    const reservationData: Reservation = {
      id: reservation.id,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      status: reservation.status,
      // Explicitly convert to Number to satisfy linter
      price: Number(reservation.totalPrice ?? 0),
      participantCount: reservation.participantCount ?? undefined,
      // Explicitly convert to Number to satisfy linter
      totalPrice: Number(reservation.totalPrice ?? undefined),
      paymentStatus: reservation.paymentStatus ?? undefined,
    };

    const userData: User = {
      id: reservation.user.id,
      name: reservation.user.name ?? '',
      email: reservation.user.email,
    };

    const sportFieldData: SportField = {
      id: reservation.sportField.id,
      name: reservation.sportField.name ?? '',
      type: reservation.sportField.type ?? '',
      // Explicitly convert to Number to satisfy linter
      price: Number(reservation.sportField.pricePerHour ?? 0),
    };

    const clubData: Club = {
      id: reservation.sportField.place.id,
      name: reservation.sportField.place.name ?? '',
      address: reservation.sportField.place.address ?? '',
      city: reservation.sportField.place.city ?? '',
      zipCode: reservation.sportField.place.zipCode ?? undefined,
    };

    const { subject, html, text } = reservationConfirmationTemplate(
      reservationData,
      userData,
      sportFieldData,
      clubData
    );

    // Send email
    return await sendEmail(
      reservation.user.email,
      subject,
      html,
      text
    );
  } catch (error) {
    console.error('Error sending reservation confirmation email:', error);
    return { success: false, error };
  }
}; 