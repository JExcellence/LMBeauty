'use client';

import { useCallback } from 'react';
import useSWR from 'swr';

// Mock data interfaces
export interface NextAppointment {
  id: number;
  treatmentName: string;
  dateIso: string;
  time: string;
  note?: string;
  stylistName: string;
  reschedulable: boolean;
}

export interface HistoryEntry {
  id: number;
  treatmentName: string;
  dateIso: string;
  relativeTime: string;
  note?: string;
}

export interface LoyaltyData {
  stampsTotal: number;
  stampsFilled: number;
  vouchers: Array<{
    id: number;
    title: string;
    expires?: string;
  }>;
}

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  preferences: {
    contactMethod: 'whatsapp' | 'email';
    marketingOptIn: boolean;
  };
}

// Mock API functions
const mockApi = {
  getNextAppointment: async (): Promise<NextAppointment | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data - return null for no appointment, or appointment object
    return {
      id: 1,
      treatmentName: 'Wimpernverlängerung Classic',
      dateIso: '2024-01-15T14:30:00Z',
      time: '14:30',
      note: 'Ich freue mich auf deinen zurückkehrenden Glam-Look.',
      stylistName: 'Lisa',
      reschedulable: true
    };
  },

  getHistory: async (): Promise<HistoryEntry[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: 1,
        treatmentName: 'Wimpernverlängerung Classic',
        dateIso: '2023-11-15T14:30:00Z',
        relativeTime: 'vor 2 Monaten',
        note: 'Natürlicher Look'
      },
      {
        id: 2,
        treatmentName: 'Hybridtechnik',
        dateIso: '2023-09-20T16:00:00Z',
        relativeTime: 'vor 4 Monaten',
        note: 'Perfekt für den Alltag'
      },
      {
        id: 3,
        treatmentName: 'Volumentechnik',
        dateIso: '2023-07-10T15:30:00Z',
        relativeTime: 'vor 6 Monaten',
        note: 'Glamouröser Event-Look'
      }
    ];
  },

  getLoyalty: async (): Promise<LoyaltyData> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      stampsTotal: 10,
      stampsFilled: 7,
      vouchers: [
        {
          id: 1,
          title: '10% Rabatt auf nächste Behandlung',
          expires: '2024-03-31'
        }
      ]
    };
  },

  getProfile: async (): Promise<UserProfile> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      id: 1,
      firstName: 'Anna',
      lastName: 'Müller',
      email: 'anna.mueller@example.com',
      phone: '+49 123 456789',
      preferences: {
        contactMethod: 'whatsapp',
        marketingOptIn: true
      }
    };
  },

  bookSuggestion: async (data: {
    intent: string;
    treatmentId?: number;
    preferredRange?: string;
    contactMethod: string;
    name: string;
    contact: string;
  }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { requestId: Math.random().toString(36).substr(2, 9) };
  },

  reschedule: async (data: {
    appointmentId: number;
    preferredRange: string;
  }) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true };
  }
};

// Custom hooks
export function useNextAppointment() {
  const { data, error, isLoading, mutate } = useSWR(
    'next-appointment',
    mockApi.getNextAppointment,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    appointment: data,
    isLoading,
    error: error?.message,
    refresh: mutate,
  };
}

export function useHistory() {
  const { data, error, isLoading, mutate } = useSWR(
    'appointment-history',
    mockApi.getHistory,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  const rebook = useCallback(async (historyId: number) => {
    // In real implementation, this would trigger the booking flow
    // with preselected treatment from history
    console.log('Rebooking appointment:', historyId);
  }, []);

  return {
    history: data || [],
    isLoading,
    error: error?.message,
    refresh: mutate,
    rebook,
  };
}

export function useLoyalty() {
  const { data, error, isLoading, mutate } = useSWR(
    'loyalty-data',
    mockApi.getLoyalty,
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000, // 10 minutes
    }
  );

  const redeemVoucher = useCallback(async (voucherId: number) => {
    console.log('Redeeming voucher:', voucherId);
    // In real implementation, this would call the API
  }, []);

  return {
    loyalty: data,
    isLoading,
    error: error?.message,
    refresh: mutate,
    redeemVoucher,
  };
}

export function useProfile() {
  const { data, error, isLoading, mutate } = useSWR(
    'user-profile',
    mockApi.getProfile,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      // In real implementation, this would call PUT /api/me
      console.log('Updating profile:', updates);
      await new Promise(resolve => setTimeout(resolve, 500));
      if (data) {
        mutate({ ...data, ...updates }, false);
      }
    } catch (err) {
      throw err;
    }
  }, [data, mutate]);

  return {
    profile: data,
    isLoading,
    error: error?.message,
    refresh: mutate,
    updateProfile,
  };
}

export function useBooking() {
  const bookSuggestion = useCallback(async (data: {
    intent: string;
    treatmentId?: number;
    preferredRange?: string;
    contactMethod: string;
    name: string;
    contact: string;
  }) => {
    return await mockApi.bookSuggestion(data);
  }, []);

  const reschedule = useCallback(async (data: {
    appointmentId: number;
    preferredRange: string;
  }) => {
    return await mockApi.reschedule(data);
  }, []);

  return {
    bookSuggestion,
    reschedule,
  };
}