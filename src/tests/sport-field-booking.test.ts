import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { db } from '@/lib/db';

// Mock NextRequest and NextResponse
class MockNextRequest {
  private url: string;
  private options: any;

  constructor(url: string, options?: any) {
    this.url = url;
    this.options = options || {};
  }

  json() {
    return Promise.resolve(JSON.parse(this.options.body || '{}'));
  }

  get cookies() {
    return { get: jest.fn() };
  }
}

class MockNextResponse {
  static json(data: any, options?: any) {
    return {
      status: options?.status || 200,
      json: () => Promise.resolve(data),
      data,
    };
  }
}

// Mock the NextRequest and NextResponse imports
jest.mock('next/server', () => ({
  NextRequest: MockNextRequest,
  NextResponse: {
    json: (data: any, options?: any) => MockNextResponse.json(data, options),
  },
}));

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(() => Promise.resolve({
    user: {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
    }
  }))
}));

// Mock the email service
jest.mock('@/lib/email', () => ({
  sendReservationConfirmationEmail: jest.fn(() => Promise.resolve({ success: true })),
}));

// Mock Stripe
jest.mock('@/lib/stripe', () => ({
  __esModule: true,
  default: {
    checkout: {
      sessions: {
        create: jest.fn(() => Promise.resolve({ id: 'test-session-id', url: 'https://checkout.stripe.com/test' })),
      },
    },
  },
  createCheckoutSession: jest.fn(() => Promise.resolve({ 
    url: 'https://checkout.stripe.com/test', 
    sessionId: 'test-session-id' 
  })),
}));

// Import the API routes (after all mocks are set up)
import { GET as getSportFields } from '@/app/api/clubs/[id]/sport-fields/route';
import { GET as getFieldReservations } from '@/app/api/clubs/[id]/sport-fields/[fieldId]/reservations/route';
import { POST as createReservation } from '@/app/api/reservations/route';
import { POST as createPaymentSession } from '@/app/api/reservations/[id]/payment/route';

describe('Sport Field Booking System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Sport Fields API', () => {
    it('should return sport fields for a club', async () => {
      // Arrange: Mock database response
      const mockSportFields = [
        {
          id: 'field-1',
          name: 'Tennis Court 1',
          description: 'Professional tennis court',
          type: 'TENNIS',
          surface: 'Hard court',
          indoor: false,
          pricePerHour: '200',
          currency: 'MAD',
          status: 'AVAILABLE',
        },
        {
          id: 'field-2',
          name: 'Football Field',
          description: 'Full-size football field',
          type: 'FOOTBALL',
          surface: 'Grass',
          indoor: false,
          pricePerHour: '500',
          currency: 'MAD',
          status: 'AVAILABLE',
        },
      ];

      (db.sportField.findMany as jest.Mock).mockResolvedValue(mockSportFields);
      
      // Act: Call the API handler
      const req = new MockNextRequest('http://localhost:3000/api/clubs/club-1/sport-fields');
      const params = { id: 'club-1' };
      const response = await getSportFields(req, { params });
      
      // Assert: Verify the response
      expect(response).toBeDefined();
      expect(response.data).toEqual({ sportFields: mockSportFields });
    });
  });

  describe('Reservations API', () => {
    it('should return existing reservations for a sport field', async () => {
      // Arrange: Mock database response
      const mockReservations = [
        {
          id: 'res-1',
          startTime: '2023-04-15T10:00:00Z',
          endTime: '2023-04-15T11:00:00Z',
          status: 'CONFIRMED',
          sportFieldId: 'field-1',
          userId: 'user-1',
          participantCount: 2,
        },
        {
          id: 'res-2',
          startTime: '2023-04-15T14:00:00Z',
          endTime: '2023-04-15T16:00:00Z',
          status: 'PENDING',
          sportFieldId: 'field-1',
          userId: 'user-2',
          participantCount: 4,
        },
      ];

      (db.reservation.findMany as jest.Mock).mockResolvedValue(mockReservations);
      
      // Act: Call the API handler
      const url = new URL('http://localhost:3000/api/clubs/club-1/sport-fields/field-1/reservations');
      url.searchParams.set('start', '2023-04-01T00:00:00Z');
      url.searchParams.set('end', '2023-04-30T23:59:59Z');
      
      const req = new MockNextRequest(url.toString());
      const params = { id: 'club-1', fieldId: 'field-1' };
      const response = await getFieldReservations(req, { params });
      
      // Assert: Verify the response
      expect(response).toBeDefined();
      expect(response.data).toEqual({ reservations: mockReservations });
    });

    it('should create a new reservation successfully', async () => {
      // Arrange: Mock database responses
      const mockSportField = {
        id: 'field-1',
        pricePerHour: '200',
        status: 'AVAILABLE',
      };

      const mockReservation = {
        id: 'new-res-id',
        startTime: new Date('2023-04-20T10:00:00Z'),
        endTime: new Date('2023-04-20T12:00:00Z'),
        status: 'PENDING',
        totalPrice: '400',
        sportFieldId: 'field-1',
        userId: 'test-user-id',
        paymentStatus: 'UNPAID',
      };

      (db.sportField.findUnique as jest.Mock).mockResolvedValue(mockSportField);
      (db.reservation.findFirst as jest.Mock).mockResolvedValue(null); // No conflict
      (db.reservation.create as jest.Mock).mockResolvedValue(mockReservation);
      
      // Act: Call the API handler
      const req = new MockNextRequest('http://localhost:3000/api/reservations', {
        method: 'POST',
        body: JSON.stringify({
          startTime: '2023-04-20T10:00:00Z',
          endTime: '2023-04-20T12:00:00Z',
          sportFieldId: 'field-1',
          participantCount: 2,
          notes: 'Test reservation',
        }),
      });
      
      const response = await createReservation(req);
      
      // Assert: Verify the response
      expect(response).toBeDefined();
      expect(response.status).toBe(201);
      expect(response.data).toEqual(mockReservation);
    });

    it('should reject a reservation when time slot is already booked', async () => {
      // Arrange: Mock database responses
      const mockSportField = {
        id: 'field-1',
        pricePerHour: '200',
        status: 'AVAILABLE',
      };

      const existingReservation = {
        id: 'existing-res',
        startTime: new Date('2023-04-20T11:00:00Z'),
        endTime: new Date('2023-04-20T13:00:00Z'),
      };

      (db.sportField.findUnique as jest.Mock).mockResolvedValue(mockSportField);
      (db.reservation.findFirst as jest.Mock).mockResolvedValue(existingReservation);
      
      // Act: Call the API handler
      const req = new MockNextRequest('http://localhost:3000/api/reservations', {
        method: 'POST',
        body: JSON.stringify({
          startTime: '2023-04-20T10:00:00Z',
          endTime: '2023-04-20T12:00:00Z',
          sportFieldId: 'field-1',
          participantCount: 2,
        }),
      });
      
      const response = await createReservation(req);
      
      // Assert: Verify the response
      expect(response).toBeDefined();
      expect(response.status).toBe(400);
      expect(response.data.error).toBe('The selected time slot is already booked');
    });
  });

  describe('Payment API', () => {
    it('should create a payment session for a reservation', async () => {
      // Arrange: Mock database responses
      const mockReservation = {
        id: 'res-id',
        userId: 'test-user-id',
        paymentStatus: 'UNPAID',
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
        },
      };

      (db.reservation.findUnique as jest.Mock).mockResolvedValue(mockReservation);
      
      // Act: Call the API handler
      const req = new MockNextRequest('http://localhost:3000/api/reservations/res-id/payment', {
        method: 'POST',
      });
      
      const params = { id: 'res-id' };
      const response = await createPaymentSession(req, { params });
      
      // Assert: Verify the response
      expect(response).toBeDefined();
      expect(response.data).toEqual({
        url: 'https://checkout.stripe.com/test',
        sessionId: 'test-session-id',
      });
    });

    it('should reject payment for already paid reservation', async () => {
      // Arrange: Mock database responses
      const mockReservation = {
        id: 'res-id',
        userId: 'test-user-id',
        paymentStatus: 'PAID',
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
        },
      };

      (db.reservation.findUnique as jest.Mock).mockResolvedValue(mockReservation);
      
      // Act: Call the API handler
      const req = new MockNextRequest('http://localhost:3000/api/reservations/res-id/payment', {
        method: 'POST',
      });
      
      const params = { id: 'res-id' };
      const response = await createPaymentSession(req, { params });
      
      // Assert: Verify the response
      expect(response).toBeDefined();
      expect(response.status).toBe(400);
      expect(response.data.error).toBe('This reservation has already been paid for');
    });
  });
}); 