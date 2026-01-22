'use client';

import { useState, useCallback, useMemo } from 'react';
import useSWR from 'swr';
import {
  treatmentApi,
  availabilityApi,
  appointmentApi,
  loyaltyApi,
  Treatment,
  TreatmentCategory,
  TimeSlot,
  Appointment,
  LoyaltyStatus,
  BookAppointmentRequest,
} from '@/lib/bookingApi';

export type BookingStep = 'service' | 'datetime' | 'details' | 'confirm' | 'success';

export interface BookingState {
  step: BookingStep;
  selectedCategory: TreatmentCategory | null;
  selectedTreatment: Treatment | null;
  selectedDate: string | null;
  selectedTime: string | null;
  customerNotes: string;
  applyLoyaltyReward: boolean;
}

const initialState: BookingState = {
  step: 'service',
  selectedCategory: null,
  selectedTreatment: null,
  selectedDate: null,
  selectedTime: null,
  customerNotes: '',
  applyLoyaltyReward: false,
};

export function useBookingFlow() {
  const [state, setState] = useState<BookingState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null);

  const setStep = useCallback((step: BookingStep) => {
    setState(prev => ({ ...prev, step }));
    setError(null);
  }, []);

  const selectCategory = useCallback((category: TreatmentCategory) => {
    setState(prev => ({ ...prev, selectedCategory: category }));
  }, []);

  const selectTreatment = useCallback((treatment: Treatment) => {
    setState(prev => ({
      ...prev,
      selectedTreatment: treatment,
      selectedDate: null,
      selectedTime: null,
      step: 'datetime',
    }));
    setError(null);
  }, []);

  const selectDate = useCallback((date: string) => {
    setState(prev => ({
      ...prev,
      selectedDate: date,
      selectedTime: null,
    }));
  }, []);

  const selectTime = useCallback((time: string) => {
    setState(prev => ({
      ...prev,
      selectedTime: time,
      step: 'details',
    }));
    setError(null);
  }, []);

  const setCustomerNotes = useCallback((notes: string) => {
    setState(prev => ({ ...prev, customerNotes: notes }));
  }, []);

  const setApplyLoyaltyReward = useCallback((apply: boolean) => {
    setState(prev => ({ ...prev, applyLoyaltyReward: apply }));
  }, []);

  const goToConfirm = useCallback(() => {
    setState(prev => ({ ...prev, step: 'confirm' }));
  }, []);

  const goBack = useCallback(() => {
    setState(prev => {
      switch (prev.step) {
        case 'datetime':
          return { ...prev, step: 'service' };
        case 'details':
          return { ...prev, step: 'datetime' };
        case 'confirm':
          return { ...prev, step: 'details' };
        default:
          return prev;
      }
    });
    setError(null);
  }, []);

  const submitBooking = useCallback(async () => {
    if (!state.selectedTreatment || !state.selectedDate || !state.selectedTime) {
      setError('Bitte wähle eine Behandlung, ein Datum und eine Uhrzeit aus.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const scheduledAt = `${state.selectedDate}T${state.selectedTime}:00`;
      const request: BookAppointmentRequest = {
        treatmentId: state.selectedTreatment.id,
        scheduledAt,
        customerNotes: state.customerNotes || undefined,
      };

      const appointment = await appointmentApi.book(request);
      setBookedAppointment(appointment);
      setState(prev => ({ ...prev, step: 'success' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Buchung fehlgeschlagen');
    } finally {
      setIsSubmitting(false);
    }
  }, [state]);

  const reset = useCallback(() => {
    setState(initialState);
    setError(null);
    setBookedAppointment(null);
  }, []);

  return {
    state,
    isSubmitting,
    error,
    bookedAppointment,
    setStep,
    selectCategory,
    selectTreatment,
    selectDate,
    selectTime,
    setCustomerNotes,
    setApplyLoyaltyReward,
    goToConfirm,
    goBack,
    submitBooking,
    reset,
  };
}

// Hook for fetching treatments
export function useTreatments(category?: TreatmentCategory) {
  const { data, error, isLoading, mutate } = useSWR(
    category ? `treatments-${category}` : 'treatments-all',
    () => category ? treatmentApi.getByCategory(category) : treatmentApi.getAll(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const treatmentsByCategory = useMemo(() => {
    if (!data) return {} as Record<TreatmentCategory, Treatment[]>;
    return data.reduce((acc, treatment) => {
      const cat = treatment.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(treatment);
      return acc;
    }, {} as Record<TreatmentCategory, Treatment[]>);
  }, [data]);

  return {
    treatments: data || [],
    treatmentsByCategory,
    isLoading,
    error: error?.message,
    refresh: mutate,
  };
}

// Hook for fetching available time slots
export function useAvailability(treatmentId: number | null, date: string | null) {
  const shouldFetch = treatmentId !== null && date !== null;

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `slots-${treatmentId}-${date}` : null,
    () => availabilityApi.getSlots(treatmentId!, date!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  const availableSlots = useMemo(() => {
    if (!data?.slots) return [];
    return data.slots.filter(slot => slot.available);
  }, [data]);

  return {
    slots: data?.slots || [],
    availableSlots,
    isLoading,
    error: error?.message,
    refresh: mutate,
  };
}

// Hook for fetching user's appointments
export function useMyAppointments() {
  const { data, error, isLoading, mutate } = useSWR(
    'my-appointments',
    () => appointmentApi.getMyAppointments(),
    {
      revalidateOnFocus: true,
      dedupingInterval: 10000,
    }
  );

  const upcomingAppointments = useMemo(() => {
    if (!data) return [];
    const now = new Date();
    return data
      .filter(apt => new Date(apt.scheduledAt) > now && 
        ['PENDING', 'CONFIRMED'].includes(apt.status))
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  }, [data]);

  const pastAppointments = useMemo(() => {
    if (!data) return [];
    const now = new Date();
    return data
      .filter(apt => new Date(apt.scheduledAt) <= now || 
        ['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(apt.status))
      .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
  }, [data]);

  return {
    appointments: data || [],
    upcomingAppointments,
    pastAppointments,
    isLoading,
    error: error?.message,
    refresh: mutate,
  };
}

// Hook for loyalty status
export function useLoyaltyStatus() {
  const { data, error, isLoading, mutate } = useSWR(
    'loyalty-status',
    () => loyaltyApi.getStatus(),
    {
      revalidateOnFocus: true,
      dedupingInterval: 30000,
    }
  );

  const redeemReward = useCallback(async () => {
    try {
      const newStatus = await loyaltyApi.redeemReward();
      mutate(newStatus, false);
      return newStatus;
    } catch (err) {
      throw err;
    }
  }, [mutate]);

  return {
    status: data,
    isLoading,
    error: error?.message,
    redeemReward,
    refresh: mutate,
  };
}

export default {
  useBookingFlow,
  useTreatments,
  useAvailability,
  useMyAppointments,
  useLoyaltyStatus,
};
