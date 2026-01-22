import { useState, useEffect, useCallback } from 'react';
import { RefillEligibility, RefillOption } from '@/components/booking/RefillPricingCard';

interface UseRefillEligibilityOptions {
  customerId?: string;
  treatmentId?: string;
  enabled?: boolean;
  onError?: (error: Error) => void;
}

interface UseRefillEligibilityReturn {
  eligibility: RefillEligibility | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

// Simple in-memory cache for refill eligibility
const eligibilityCache = new Map<string, { data: RefillEligibility; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Hook for fetching and managing refill eligibility data.
 */
export function useRefillEligibility({
  customerId,
  treatmentId,
  enabled = true,
  onError
}: UseRefillEligibilityOptions): UseRefillEligibilityReturn {
  const [eligibility, setEligibility] = useState<RefillEligibility | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cacheKey = `${customerId}-${treatmentId}`;

  const fetchEligibility = useCallback(async () => {
    if (!customerId || !treatmentId || !enabled) {
      return;
    }

    // Check cache first
    const cached = eligibilityCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setEligibility(cached.data);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/refills/calculate?customerId=${customerId}&treatmentId=${treatmentId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch refill eligibility: ${response.status}`);
      }

      const data: RefillEligibility = await response.json();
      
      // Cache the result
      eligibilityCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      setEligibility(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [customerId, treatmentId, enabled, cacheKey, onError]);

  const clearCache = useCallback(() => {
    eligibilityCache.delete(cacheKey);
  }, [cacheKey]);

  useEffect(() => {
    fetchEligibility();
  }, [fetchEligibility]);

  return {
    eligibility,
    isLoading,
    error,
    refetch: fetchEligibility,
    clearCache
  };
}

/**
 * Hook for checking if a customer is eligible for refill within max weeks.
 */
export function useIsRefillEligible(
  customerId?: string,
  treatmentId?: string,
  maxWeeks: number = 4
): { isEligible: boolean; isLoading: boolean; error: Error | null } {
  const [isEligible, setIsEligible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!customerId || !treatmentId) {
      setIsEligible(false);
      return;
    }

    const checkEligibility = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/refills/eligible?customerId=${customerId}&treatmentId=${treatmentId}&maxWeeks=${maxWeeks}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to check refill eligibility: ${response.status}`);
        }

        const eligible: boolean = await response.json();
        setIsEligible(eligible);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error occurred');
        setError(error);
        setIsEligible(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkEligibility();
  }, [customerId, treatmentId, maxWeeks]);

  return { isEligible, isLoading, error };
}

/**
 * Hook for getting the best refill option for a customer.
 */
export function useBestRefillOption(
  customerId?: string,
  treatmentId?: string
): { bestOption: RefillOption | null; isLoading: boolean; error: Error | null } {
  const [bestOption, setBestOption] = useState<RefillOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!customerId || !treatmentId) {
      setBestOption(null);
      return;
    }

    const fetchBestOption = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/refills/best-option?customerId=${customerId}&treatmentId=${treatmentId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 204) {
          setBestOption(null);
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch best refill option: ${response.status}`);
        }

        const option: RefillOption = await response.json();
        setBestOption(option);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error occurred');
        setError(error);
        setBestOption(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBestOption();
  }, [customerId, treatmentId]);

  return { bestOption, isLoading, error };
}

/**
 * Hook for batch fetching refill eligibility for multiple treatments.
 */
export function useBatchRefillEligibility(
  customerId?: string,
  treatmentIds: string[] = []
): { 
  eligibilities: Record<string, RefillEligibility>; 
  isLoading: boolean; 
  error: Error | null;
  refetchAll: () => Promise<void>;
} {
  const [eligibilities, setEligibilities] = useState<Record<string, RefillEligibility>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAllEligibilities = useCallback(async () => {
    if (!customerId || treatmentIds.length === 0) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const promises = treatmentIds.map(async (treatmentId) => {
        const cacheKey = `${customerId}-${treatmentId}`;
        const cached = eligibilityCache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          return { treatmentId, eligibility: cached.data };
        }

        const response = await fetch(
          `/api/refills/calculate?customerId=${customerId}&treatmentId=${treatmentId}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch eligibility for treatment ${treatmentId}`);
        }

        const eligibility: RefillEligibility = await response.json();
        
        // Cache the result
        eligibilityCache.set(cacheKey, {
          data: eligibility,
          timestamp: Date.now()
        });

        return { treatmentId, eligibility };
      });

      const results = await Promise.all(promises);
      const eligibilityMap = results.reduce((acc, { treatmentId, eligibility }) => {
        acc[treatmentId] = eligibility;
        return acc;
      }, {} as Record<string, RefillEligibility>);

      setEligibilities(eligibilityMap);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [customerId, treatmentIds]);

  useEffect(() => {
    fetchAllEligibilities();
  }, [fetchAllEligibilities]);

  return {
    eligibilities,
    isLoading,
    error,
    refetchAll: fetchAllEligibilities
  };
}

/**
 * Utility function to clear all refill eligibility cache.
 */
export function clearAllRefillCache(): void {
  eligibilityCache.clear();
}