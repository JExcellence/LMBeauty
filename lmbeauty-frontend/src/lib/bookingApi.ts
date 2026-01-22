import { apiClient, handleApiError } from './api';

// Types - Booking API
export type TreatmentCategory = 'WIMPERN' | 'AUGENBRAUEN' | 'GESICHT' | 'NAEGEL' | 'REFILL' | 'EXTRAS';

export interface Treatment {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: TreatmentCategory;
  durationMinutes: number;
  price: number;
  imageUrl?: string;
  active: boolean;
  sortOrder: number;
  versionNumber?: number;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface AvailableSlotsResponse {
  date: string;
  treatmentId: number;
  slots: TimeSlot[];
}

export interface BookAppointmentRequest {
  treatmentId: number;
  scheduledAt: string;
  customerNotes?: string;
}

export interface Appointment {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  treatmentId: number;
  treatmentName: string;
  scheduledAt: string;
  durationMinutes: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'REJECTED' | 'NO_SHOW';
  customerNotes?: string;
  ownerNotes?: string;
  rejectionReason?: string;
  confirmedAt?: string;
  cancelledAt?: string;
  completedAt?: string;
}

export interface LoyaltyStatus {
  userId: number;
  currentStamps: number;
  totalStamps: number;
  currentCycle: number;
  rewardAvailable: boolean;
  rewardDiscount: number;
  stampsToNextReward: number;
}

export interface LoyaltyStamp {
  id: number;
  userId: number;
  appointmentId: number;
  treatmentName: string;
  earnedAt: string;
  redeemed: boolean;
  redeemedAt?: string;
  cycleNumber: number;
}

// Treatment API
export const treatmentApi = {
  getAll: async (): Promise<Treatment[]> => {
    try {
      console.log('Fetching treatments from /treatments');
      const response = await apiClient.get<Treatment[]>('/treatments');
      console.log('Treatments response:', response);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching treatments:', error);
      throw new Error(handleApiError(error));
    }
  },

  getByCategory: async (category: TreatmentCategory): Promise<Treatment[]> => {
    try {
      if (!category || category === undefined) {
        throw new Error('Category is required');
      }
      console.log(`Fetching treatments for category: ${category}`);
      const response = await apiClient.get<Treatment[]>(`/treatments/category/${category}`);
      console.log(`Treatments for ${category}:`, response);
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching treatments for category ${category}:`, error);
      throw new Error(handleApiError(error));
    }
  },

  getById: async (id: number): Promise<Treatment> => {
    try {
      if (!id || id === undefined) {
        throw new Error('Treatment ID is required');
      }
      const response = await apiClient.get<Treatment>(`/treatments/${id}`);
      return response.data!;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getBySlug: async (slug: string): Promise<Treatment> => {
    try {
      if (!slug || slug === 'undefined') {
        throw new Error('Treatment slug is required');
      }
      const response = await apiClient.get<Treatment>(`/treatments/slug/${slug}`);
      return response.data!;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// Availability API
export const availabilityApi = {
  getSlots: async (treatmentId: number, date: string): Promise<AvailableSlotsResponse> => {
    try {
      // Validate parameters
      if (!treatmentId || treatmentId === undefined || !date || date === 'undefined') {
        throw new Error('Invalid parameters: treatmentId and date are required');
      }
      
      const response = await apiClient.get<AvailableSlotsResponse>(
        `/slots?treatmentId=${treatmentId}&date=${date}`
      );
      return response.data!;
    } catch (error: any) {
      // Handle unauthorized error specifically
      if (error?.response?.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error(handleApiError(error));
    }
  },

  getSlotsRange: async (
    treatmentId: number,
    from: string,
    to: string
  ): Promise<AvailableSlotsResponse[]> => {
    try {
      // Validate parameters
      if (!treatmentId || treatmentId === undefined || !from || from === 'undefined' || !to || to === 'undefined') {
        throw new Error('Invalid parameters: treatmentId, from, and to are required');
      }
      
      const response = await apiClient.get<AvailableSlotsResponse[]>(
        `/slots/range?treatmentId=${treatmentId}&from=${from}&to=${to}`
      );
      return response.data || [];
    } catch (error: any) {
      // Handle unauthorized error specifically
      if (error?.response?.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error(handleApiError(error));
    }
  },
};

// Appointment API
export const appointmentApi = {
  book: async (request: BookAppointmentRequest): Promise<Appointment> => {
    try {
      const response = await apiClient.post<Appointment>('/appointments', request);
      return response.data!;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getMyAppointments: async (): Promise<Appointment[]> => {
    try {
      const response = await apiClient.get<Appointment[]>('/appointments/my');
      return response.data || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  cancel: async (appointmentId: number): Promise<void> => {
    try {
      await apiClient.delete(`/appointments/${appointmentId}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// Loyalty API
export const loyaltyApi = {
  getStatus: async (): Promise<LoyaltyStatus> => {
    try {
      const response = await apiClient.get<LoyaltyStatus>('/loyalty/status');
      return response.data!;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getHistory: async (): Promise<LoyaltyStamp[]> => {
    try {
      const response = await apiClient.get<LoyaltyStamp[]>('/loyalty/history');
      return response.data || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  redeemReward: async (): Promise<LoyaltyStatus> => {
    try {
      const response = await apiClient.post<LoyaltyStatus>('/loyalty/redeem');
      return response.data!;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

export default {
  treatments: treatmentApi,
  availability: availabilityApi,
  appointments: appointmentApi,
  loyalty: loyaltyApi,
};
