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
    // Fetch reservation with all related data
    if (!prisma) throw new Error('Prisma client is not initialized');
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        user: true,
        sportField: {
          include: {
            club: true,
          },
        },
      },
    });

    if (!reservation || !reservation.user || !reservation.sportField || !reservation.sportField.club) {
      throw new Error('Reservation, user, sport field, or club not found');
    }

    // Get email template
    const reservationData: Reservation = {
      id: reservation.id,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      status: reservation.status,
      price: reservation.totalPrice && typeof reservation.totalPrice === 'object' && 'toNumber' in reservation.totalPrice ? reservation.totalPrice.toNumber() : reservation.totalPrice ?? 0,
      participantCount: reservation.participantCount ?? undefined,
      totalPrice: reservation.totalPrice && typeof reservation.totalPrice === 'object' && 'toNumber' in reservation.totalPrice ? reservation.totalPrice.toNumber() : reservation.totalPrice ?? undefined,
      paymentStatus: reservation.paymentStatus ?? undefined,
    };

    const userData: User = {
      id: reservation.user.id,
      name: reservation.user.name ?? '',
      email: reservation.user.email,
    };

    // Defensive: sportField might be nested under reservation.sportField, or reservation.sportField.sportField
    const sportFieldRaw = reservation.sportField && typeof reservation.sportField === 'object' ? reservation.sportField : null;
    const sportField = sportFieldRaw && 'sportField' in sportFieldRaw && typeof sportFieldRaw.sportField === 'object' ? sportFieldRaw.sportField : sportFieldRaw;
    const clubRaw = sportField && typeof sportField === 'object' && 'club' in sportField ? sportField.club : null;
    const club = clubRaw && typeof clubRaw === 'object' ? clubRaw : null;

    // Use type assertion to bypass complex type checking
    const sportFieldData: SportField = {
      id: '',
      name: '',
      type: '',
      price: 0
    };

    // Set properties safely if they exist
    if (sportField) {
      if ('id' in sportField) sportFieldData.id = String(sportField.id || '');
      if ('name' in sportField) sportFieldData.name = String(sportField.name || '');
      if ('type' in sportField) sportFieldData.type = String(sportField.type || '');
      if ('pricePerHour' in sportField) {
        const price = sportField.pricePerHour;
        if (typeof price === 'object' && price && 'toNumber' in price && typeof price.toNumber === 'function') {
          sportFieldData.price = price.toNumber();
        } else {
          sportFieldData.price = Number(price) || 0;
        }
      }
    }

    // Use type assertion to bypass complex type checking
    const clubData: Club = {
      id: '',
      name: '',
      address: '',
      city: ''
    };

    // Set properties safely if they exist
    if (club) {
      if ('id' in club) clubData.id = String(club.id || '');
      if ('name' in club) clubData.name = String(club.name || '');
      if ('address' in club) clubData.address = String(club.address || '');
      if ('city' in club) clubData.city = String(club.city || '');
      if ('zipCode' in club) clubData.zipCode = club.zipCode ? String(club.zipCode) : undefined;
    }

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