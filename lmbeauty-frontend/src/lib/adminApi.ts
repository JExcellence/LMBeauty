import { apiClient, handleApiError } from './api';
import type { Appointment, LoyaltyStatus } from './bookingApi';

export interface DashboardMetrics {
  todayAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedThisWeek: number;
  weeklyRevenue: number;
  totalCustomers: number;
  newCustomersThisMonth: number;
  upcomingAppointments: Appointment[];
}

export interface CustomerSummary {
  id: number;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string | null;
  totalAppointments: number;
  completedAppointments: number;
  lastVisit: string | null;
  loyaltyStamps: number;
}

export interface CustomerProfile {
  id: number;
  firstName: string | null;
  lastName: string | null;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  totalAppointments: number;
  completedAppointments: number;
  lastVisit: string | null;
  loyaltyStatus: LoyaltyStatus;
  recentAppointments: Appointment[];
  notes: string | null;
  active: boolean;
  profileImage?: string;
}

export interface CustomerUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  notes?: string;
  active?: boolean;
}

export interface BlockedPeriodRequest {
  startDateTime: string;
  endDateTime: string;
  reason?: string;
}

export interface BlockedPeriod {
  id: number;
  startDateTime: string;
  endDateTime: string;
  reason: string | null;
}

// Admin API
export const adminApi = {
  getDashboard: async (): Promise<DashboardMetrics> => {
    try {
      const response = await apiClient.get<DashboardMetrics>('/admin/dashboard');
      return response.data!;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getTodayAppointments: async (): Promise<Appointment[]> => {
    try {
      const response = await apiClient.get<Appointment[]>('/admin/appointments/today');
      return response.data || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getAppointments: async (from: string, to: string, status?: string): Promise<Appointment[]> => {
    try {
      let url = `/admin/appointments?from=${from}&to=${to}`;
      if (status) url += `&status=${status}`;
      const response = await apiClient.get<Appointment[]>(url);
      return response.data || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getCustomers: async (search?: string): Promise<CustomerSummary[]> => {
    try {
      let url = '/admin/customers';
      if (search) url += `?search=${encodeURIComponent(search)}`;
      const response = await apiClient.get<CustomerSummary[]>(url);
      return response.data || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getCustomerProfile: async (id: number): Promise<CustomerProfile> => {
    try {
      const response = await apiClient.get<CustomerProfile>(`/admin/customers/${id}`);
      return response.data!;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  updateCustomer: async (id: number, data: CustomerUpdateRequest): Promise<CustomerProfile> => {
    try {
      const response = await apiClient.put<CustomerProfile>(`/admin/customers/${id}`, data);
      return response.data!;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  toggleCustomerStatus: async (id: number, active: boolean): Promise<CustomerProfile> => {
    try {
      const response = await apiClient.patch<CustomerProfile>(`/admin/customers/${id}/status`, { active });
      return response.data!;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  blockTime: async (request: BlockedPeriodRequest): Promise<BlockedPeriod> => {
    try {
      const response = await apiClient.post<BlockedPeriod>('/admin/availability/block', request);
      return response.data!;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  unblockTime: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/admin/availability/block/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Availability management
  getAvailability: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get<any[]>('/availability/weekly');
      return response.data || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getSpecificDateAvailability: async (date: string): Promise<any[]> => {
    try {
      const response = await apiClient.get<any[]>(`/availability/date/${date}`);
      return response.data || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Force token refresh
  refreshToken: async (): Promise<void> => {
    try {
      console.log('Forcing token refresh...');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const refreshResponse = await fetch(`${baseUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
        credentials: 'include'
      });
      
      if (!refreshResponse.ok) {
        throw new Error('Token refresh failed');
      }
      
      const data = await refreshResponse.json();
      console.log('Token refresh response:', data);
      
      if (data.token) {
        localStorage.setItem('accessToken', data.token);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        console.log('Tokens updated successfully');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  },

  // Debug function to check auth status
  checkAuthStatus: async (): Promise<any> => {
    try {
      console.log('Checking auth status...');
      const response = await apiClient.get('/auth/me');
      console.log('Auth status response:', response);
      return response.data;
    } catch (error: any) {
      console.error('Auth status check failed:', error);
      console.error('Error response:', error?.response?.data);
      console.error('Error status:', error?.response?.status);
      throw new Error(handleApiError(error));
    }
  },

  updateAvailability: async (day: string, slots: any[]): Promise<void> => {
    try {
      console.log('Updating availability for day:', day, 'with slots:', slots);
      
      // Convert slots to WeeklyAvailabilityRequest format
      const requests = slots.map(slot => ({
        dayOfWeek: day.toUpperCase(),
        startTime: slot.startTime,
        endTime: slot.endTime,
        active: true
      }));
      
      const response = await apiClient.put(`/availability/weekly/day/${day}`, requests);
      console.log('Availability update successful');
    } catch (error: any) {
      console.error('Availability update error:', error);
      
      // Let the API interceptor handle 401 errors
      // Just re-throw the error with a user-friendly message
      if (error.message.includes('Session abgelaufen') || error.message.includes('expired')) {
        throw error; // Re-throw session expired errors as-is
      }
      
      throw new Error(handleApiError(error));
    }
  },

  updateSpecificDateAvailability: async (date: string, slots: any[]): Promise<void> => {
    try {
      console.log('Updating availability for specific date:', date, 'with slots:', slots);
      
      const response = await apiClient.put(`/availability/date/${date}`, { slots });
      console.log('Specific date availability update successful');
    } catch (error: any) {
      console.error('Specific date availability update error:', error);
      throw new Error(handleApiError(error));
    }
  },

  updateWeekAvailability: async (startDate: string, availability: any): Promise<void> => {
    try {
      await apiClient.put('/admin/availability/week', { startDate, availability });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Treatment management
  getTreatments: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get<any[]>('/treatments/all');
      return response.data || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  createTreatment: async (treatment: any): Promise<any> => {
    try {
      const response = await apiClient.post<any>('/treatments', treatment);
      return response.data!;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  updateTreatment: async (id: number, treatment: any): Promise<any> => {
    try {
      const response = await apiClient.put<any>(`/treatments/${id}`, treatment);
      return response.data!;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  deleteTreatment: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/treatments/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Refill options management
  getRefillOptions: async (treatmentId: number): Promise<any[]> => {
    try {
      const response = await apiClient.get<any[]>(`/treatments/${treatmentId}/refills`);
      return response.data || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Set URL slug for treatment
  setTreatmentUrlSlug: async (treatmentId: number, urlSlug: string): Promise<void> => {
    try {
      await apiClient.put(`/treatments/${treatmentId}/url-slug?urlSlug=${encodeURIComponent(urlSlug)}`, {});
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Enable/disable refill options
  setRefillOptionsEnabled: async (treatmentId: number, enabled: boolean): Promise<void> => {
    try {
      await apiClient.put(`/treatments/${treatmentId}/refill-options?enabled=${enabled}`, {});
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Appointment actions
  confirmAppointment: async (id: number, notes?: string): Promise<Appointment> => {
    try {
      const response = await apiClient.post<Appointment>(`/appointments/${id}/confirm`, { ownerNotes: notes });
      return response.data!;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  rejectAppointment: async (id: number, reason?: string): Promise<Appointment> => {
    try {
      const response = await apiClient.post<Appointment>(`/appointments/${id}/reject`, { reason });
      return response.data!;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  completeAppointment: async (id: number, notes?: string): Promise<Appointment> => {
    try {
      const response = await apiClient.post<Appointment>(`/appointments/${id}/complete`, { ownerNotes: notes });
      return response.data!;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  markNoShow: async (id: number): Promise<Appointment> => {
    try {
      const response = await apiClient.post<Appointment>(`/appointments/${id}/no-show`, {});
      return response.data!;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

export default adminApi;
