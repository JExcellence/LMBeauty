import { apiClient } from './api';

export interface WeeklyAvailability {
  id: number;
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
  active: boolean;
}

export interface WeeklyAvailabilityRequest {
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
  active?: boolean;
}

export interface BlockedPeriod {
  id: number;
  startDateTime: string; // ISO datetime
  endDateTime: string;   // ISO datetime
  reason?: string;
}

export interface BlockedPeriodRequest {
  startDateTime: string; // ISO datetime
  endDateTime: string;   // ISO datetime
  reason?: string;
}

export const availabilityAdminApi = {
  // Weekly Availability
  getWeeklyAvailability: async (): Promise<WeeklyAvailability[]> => {
    try {
      const response = await apiClient.get<WeeklyAvailability[]>('/availability/weekly');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch weekly availability:', error);
      throw error;
    }
  },

  createWeeklyAvailability: async (request: WeeklyAvailabilityRequest): Promise<WeeklyAvailability> => {
    try {
      const response = await apiClient.post<WeeklyAvailability>('/availability/weekly', request);
      return response.data!;
    } catch (error) {
      console.error('Failed to create weekly availability:', error);
      throw error;
    }
  },

  updateWeeklyAvailability: async (id: number, request: WeeklyAvailabilityRequest): Promise<WeeklyAvailability> => {
    try {
      const response = await apiClient.put<WeeklyAvailability>(`/availability/weekly/${id}`, request);
      return response.data!;
    } catch (error) {
      console.error('Failed to update weekly availability:', error);
      throw error;
    }
  },

  deleteWeeklyAvailability: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/availability/weekly/${id}`);
    } catch (error) {
      console.error('Failed to delete weekly availability:', error);
      throw error;
    }
  },

  replaceAvailabilityForDay: async (dayOfWeek: string, slots: { startTime: string; endTime: string; active?: boolean }[]): Promise<WeeklyAvailability[]> => {
    try {
      const requests = slots.map(slot => ({
        dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        active: slot.active ?? true
      }));
      const response = await apiClient.put<WeeklyAvailability[]>(`/availability/weekly/day/${dayOfWeek}`, requests);
      return response.data || [];
    } catch (error) {
      console.error('Failed to replace availability for day:', error);
      throw error;
    }
  },

  // Blocked Periods
  getBlockedPeriods: async (): Promise<BlockedPeriod[]> => {
    try {
      const response = await apiClient.get<BlockedPeriod[]>('/availability/blocked');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch blocked periods:', error);
      throw error;
    }
  },

  createBlockedPeriod: async (request: BlockedPeriodRequest): Promise<BlockedPeriod> => {
    try {
      const response = await apiClient.post<BlockedPeriod>('/availability/blocked', request);
      return response.data!;
    } catch (error) {
      console.error('Failed to create blocked period:', error);
      throw error;
    }
  },

  deleteBlockedPeriod: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/availability/blocked/${id}`);
    } catch (error) {
      console.error('Failed to delete blocked period:', error);
      throw error;
    }
  },

  // Helper method to create default availability (Monday-Friday 9-17, Saturday 10-16)
  createDefaultAvailability: async (): Promise<WeeklyAvailability[]> => {
    const defaultSchedule = [
      { dayOfWeek: 'MONDAY' as const, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 'TUESDAY' as const, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 'WEDNESDAY' as const, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 'THURSDAY' as const, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 'FRIDAY' as const, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 'SATURDAY' as const, startTime: '10:00', endTime: '16:00' },
    ];

    const results: WeeklyAvailability[] = [];
    for (const schedule of defaultSchedule) {
      try {
        const availability = await availabilityAdminApi.createWeeklyAvailability({
          ...schedule,
          active: true
        });
        results.push(availability);
      } catch (error) {
        console.error(`Failed to create default availability for ${schedule.dayOfWeek}:`, error);
      }
    }
    return results;
  }
};

export default availabilityAdminApi;