import api from './api';
import type { User, TreatmentHistory, Appointment, ProductPurchase, CareTip } from '@/types';
import { mockTreatments, mockAppointment, mockProducts, mockCareTips } from './mockData';

// Flag to use mock data during development
const USE_MOCK_DATA = true;

export const authService = {
  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    // Backend returns ApiResponse<AuthResponse> = { success: true, data: { user: {...} } }
    const authResponse = response.data?.data || response.data;
    const userData = authResponse?.user || authResponse;
    return userData;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore logout errors
    }
  },

  getOAuthUrl: async (provider: string): Promise<string> => {
    const response = await api.get(`/oauth/${provider.toLowerCase()}/url`);
    return response.data?.data || response.data;
  },
};

/**
 * Private Beauty Space Service
 * Handles fetching user-specific data for the private area
 */
export const privateSpaceService = {
  /**
   * Fetch user's treatment history
   * @param userId - The user's ID
   * @returns Array of treatment history records
   */
  getTreatmentHistory: async (userId: string): Promise<TreatmentHistory[]> => {
    if (USE_MOCK_DATA) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockTreatments;
    }
    
    try {
      const response = await api.get(`/users/${userId}/treatments`);
      return response.data?.data || [];
    } catch (error) {
      console.error('Failed to fetch treatment history:', error);
      return [];
    }
  },

  /**
   * Fetch user's upcoming appointment
   * @param userId - The user's ID
   * @returns The next scheduled appointment or undefined
   */
  getUpcomingAppointment: async (userId: string): Promise<Appointment | undefined> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockAppointment;
    }
    
    try {
      const response = await api.get(`/users/${userId}/appointments/upcoming`);
      return response.data?.data;
    } catch (error) {
      console.error('Failed to fetch upcoming appointment:', error);
      return undefined;
    }
  },

  /**
   * Fetch user's product purchases
   * @param userId - The user's ID
   * @returns Array of product purchase records
   */
  getProductPurchases: async (userId: string): Promise<ProductPurchase[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 250));
      return mockProducts;
    }
    
    try {
      const response = await api.get(`/users/${userId}/products`);
      return response.data?.data || [];
    } catch (error) {
      console.error('Failed to fetch product purchases:', error);
      return [];
    }
  },

  /**
   * Fetch care tips relevant to user's recent treatments
   * @param userId - The user's ID
   * @param recentTreatmentIds - Optional array of recent treatment IDs for filtering
   * @returns Array of care tips
   */
  getCareTips: async (userId: string, recentTreatmentIds?: string[]): Promise<CareTip[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 150));
      // Filter tips based on recent treatments if provided
      if (recentTreatmentIds && recentTreatmentIds.length > 0) {
        return mockCareTips.filter(tip => 
          !tip.relevantTreatments || 
          tip.relevantTreatments.some(t => recentTreatmentIds.includes(t))
        ).slice(0, 2);
      }
      return mockCareTips.slice(0, 2);
    }
    
    try {
      const response = await api.get(`/users/${userId}/care-tips`, {
        params: { treatmentIds: recentTreatmentIds?.join(',') }
      });
      return response.data?.data || [];
    } catch (error) {
      console.error('Failed to fetch care tips:', error);
      return [];
    }
  },

  /**
   * Fetch all private space data in parallel
   * @param userId - The user's ID
   * @returns Object containing all private space data
   */
  getAllPrivateSpaceData: async (userId: string) => {
    const [treatments, appointment, products] = await Promise.all([
      privateSpaceService.getTreatmentHistory(userId),
      privateSpaceService.getUpcomingAppointment(userId),
      privateSpaceService.getProductPurchases(userId),
    ]);

    // Get care tips based on recent treatments
    const recentTreatmentIds = treatments.slice(0, 3).map(t => t.treatmentId);
    const careTips = await privateSpaceService.getCareTips(userId, recentTreatmentIds);

    return {
      treatments,
      appointment,
      products,
      careTips,
    };
  },
};
