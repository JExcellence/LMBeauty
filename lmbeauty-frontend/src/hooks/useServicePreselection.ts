import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  getServiceMapping, 
  isValidServiceParam, 
  ServiceParam, 
  ServiceMapping 
} from '@/config/serviceMapping';

export interface ServicePreselection {
  serviceParam: ServiceParam | null;
  mapping: ServiceMapping | null;
  isValid: boolean;
  category: string | null;
  treatmentSlugs: readonly string[];
  displayName: string | null;
  description: string | null;
}

/**
 * Hook for handling service parameter preselection from URL.
 * Parses and validates service URL parameters for treatment preselection.
 */
export function useServicePreselection(): ServicePreselection {
  const searchParams = useSearchParams();
  const service = searchParams.get('service');

  const preselection = useMemo((): ServicePreselection => {
    if (!service) {
      return {
        serviceParam: null,
        mapping: null,
        isValid: false,
        category: null,
        treatmentSlugs: [],
        displayName: null,
        description: null
      };
    }

    if (!isValidServiceParam(service)) {
      return {
        serviceParam: null,
        mapping: null,
        isValid: false,
        category: null,
        treatmentSlugs: [],
        displayName: null,
        description: null
      };
    }

    const mapping = getServiceMapping(service);
    if (!mapping) {
      return {
        serviceParam: null,
        mapping: null,
        isValid: false,
        category: null,
        treatmentSlugs: [],
        displayName: null,
        description: null
      };
    }

    return {
      serviceParam: service as ServiceParam,
      mapping,
      isValid: true,
      category: mapping.category,
      treatmentSlugs: mapping.treatmentSlugs,
      displayName: mapping.displayName,
      description: mapping.description || null
    };
  }, [service]);

  return preselection;
}

/**
 * Hook for checking if a specific service is preselected.
 */
export function useIsServicePreselected(targetService: ServiceParam): boolean {
  const { serviceParam, isValid } = useServicePreselection();
  return isValid && serviceParam === targetService;
}

/**
 * Hook for getting the current service parameter from URL.
 */
export function useCurrentServiceParam(): ServiceParam | null {
  const { serviceParam, isValid } = useServicePreselection();
  return isValid ? serviceParam : null;
}

/**
 * Hook for checking if any service is preselected.
 */
export function useHasServicePreselection(): boolean {
  const { isValid } = useServicePreselection();
  return isValid;
}