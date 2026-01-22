'use client';

import { useState, useCallback } from 'react';
import useSWR from 'swr';
import { adminApi, DashboardMetrics, CustomerSummary, CustomerProfile, CustomerUpdateRequest } from '@/lib/adminApi';
import type { Appointment } from '@/lib/bookingApi';

export function useDashboard() {
  const { data, error, isLoading, mutate } = useSWR(
    'admin-dashboard',
    () => adminApi.getDashboard(),
    {
      revalidateOnFocus: true,
      dedupingInterval: 30000,
    }
  );

  return {
    metrics: data,
    isLoading,
    error: error?.message,
    refresh: mutate,
  };
}

export function useTodayAppointments() {
  const { data, error, isLoading, mutate } = useSWR(
    'admin-today-appointments',
    () => adminApi.getTodayAppointments(),
    {
      revalidateOnFocus: true,
      dedupingInterval: 10000,
    }
  );

  return {
    appointments: data || [],
    isLoading,
    error: error?.message,
    refresh: mutate,
  };
}

export function useAdminAppointments(from: string, to: string, status?: string) {
  const { data, error, isLoading, mutate } = useSWR(
    from && to ? `admin-appointments-${from}-${to}-${status || 'all'}` : null,
    () => adminApi.getAppointments(from, to, status),
    {
      revalidateOnFocus: true,
      dedupingInterval: 10000,
    }
  );

  return {
    appointments: data || [],
    isLoading,
    error: error?.message,
    refresh: mutate,
  };
}

export function useAppointments() {
  const { data, error, isLoading, mutate } = useSWR(
    'admin-appointments',
    async () => {
      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      return await adminApi.getAppointments(today, nextWeek);
    },
    {
      revalidateOnFocus: true,
      dedupingInterval: 10000,
    }
  );

  return {
    appointments: data || [],
    isLoading,
    error: error?.message,
    refresh: mutate,
  };
}

export function useTreatments() {
  const { data, error, isLoading, mutate } = useSWR(
    'admin-treatments',
    () => adminApi.getTreatments(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const createTreatment = useCallback(async (treatment: any) => {
    try {
      const result = await adminApi.createTreatment(treatment);
      mutate();
      return result;
    } catch (err) {
      console.error('[useTreatments] Create error:', err);
      throw err;
    }
  }, [mutate]);

  const updateTreatment = useCallback(async (id: number, treatment: any) => {
    try {
      const result = await adminApi.updateTreatment(id, treatment);
      mutate();
      return result;
    } catch (err) {
      console.error('[useTreatments] Update error:', err);
      throw err;
    }
  }, [mutate]);

  const deleteTreatment = useCallback(async (id: number) => {
    try {
      await adminApi.deleteTreatment(id);
      mutate();
    } catch (err) {
      console.error('[useTreatments] Delete error:', err);
      throw err;
    }
  }, [mutate]);

  return {
    treatments: data || [],
    isLoading,
    error: error?.message,
    refresh: mutate,
    createTreatment,
    updateTreatment,
    deleteTreatment,
  };
}

export function useAvailability() {
  const { data, error, isLoading, mutate } = useSWR(
    'admin-availability',
    () => adminApi.getAvailability(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  const updateAvailability = useCallback(async (day: string, slots: any[]) => {
    try {
      await adminApi.updateAvailability(day, slots);
      mutate();
    } catch (err) {
      throw err;
    }
  }, [mutate]);

  return {
    availability: data || [],
    isLoading,
    error: error?.message,
    refresh: mutate,
    updateAvailability,
  };
}

export function useAdminCustomers() {
  const { data, error, isLoading, mutate } = useSWR(
    'admin-customers',
    () => adminApi.getCustomers(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  return {
    customers: data || [],
    isLoading,
    error: error?.message,
    refresh: mutate,
  };
}

export function useCustomers(search?: string) {
  const { data, error, isLoading, mutate } = useSWR(
    `admin-customers-${search || ''}`,
    () => adminApi.getCustomers(search),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  return {
    customers: data || [],
    isLoading,
    error: error?.message,
    refresh: mutate,
  };
}

export function useCustomerProfile(id: number | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `admin-customer-${id}` : null,
    () => adminApi.getCustomerProfile(id!),
    {
      revalidateOnFocus: false,
    }
  );

  const updateCustomer = useCallback(async (updateData: CustomerUpdateRequest) => {
    if (!id) return;
    try {
      const result = await adminApi.updateCustomer(id, updateData);
      mutate(result, false);
      return result;
    } catch (err) {
      throw err;
    }
  }, [id, mutate]);

  const toggleStatus = useCallback(async (active: boolean) => {
    if (!id) return;
    try {
      const result = await adminApi.toggleCustomerStatus(id, active);
      mutate(result, false);
      return result;
    } catch (err) {
      throw err;
    }
  }, [id, mutate]);

  return {
    profile: data,
    isLoading,
    error: error?.message,
    refresh: mutate,
    updateCustomer,
    toggleStatus,
  };
}

export function useAppointmentActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirm = useCallback(async (id: number, notes?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminApi.confirmAppointment(id, notes);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to confirm');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reject = useCallback(async (id: number, reason?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminApi.rejectAppointment(id, reason);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const complete = useCallback(async (id: number, notes?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminApi.completeAppointment(id, notes);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markNoShow = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminApi.markNoShow(id);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark no-show');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    confirm,
    reject,
    complete,
    markNoShow,
    isLoading,
    error,
  };
}

export default {
  useDashboard,
  useTodayAppointments,
  useAdminAppointments,
  useAppointments,
  useCustomers,
  useAdminCustomers,
  useTreatments,
  useAvailability,
  useCustomerProfile,
  useAppointmentActions,
};
