/**
 * Service parameter mappings for URL support.
 * Maps service parameters to treatment categories and URL slugs.
 */

export interface ServiceMapping {
  category: string;
  treatmentSlugs: readonly string[];
  displayName: string;
  description?: string;
}

export const SERVICE_MAPPING = {
  einzeltechnik: {
    category: 'wimpern',
    treatmentSlugs: ['einzeltechnik'],
    displayName: 'Einzeltechnik',
    description: 'Präzise 1:1 Technik für natürlichen Look'
  },
  refill: {
    category: 'refill',
    treatmentSlugs: ['hybrid', 'volumen'],
    displayName: 'Refill Termine',
    description: 'Auffrischung für bestehende Wimpernverlängerungen'
  },
  hybrid: {
    category: 'wimpern',
    treatmentSlugs: ['hybrid'],
    displayName: 'Hybrid',
    description: 'Kombination aus klassischer und Volumen-Technik'
  },
  volumen: {
    category: 'wimpern',
    treatmentSlugs: ['volumen'],
    displayName: 'Volumen',
    description: 'Volumen-Technik für maximale Fülle'
  },
  liftings: {
    category: 'augenbrauen',
    treatmentSlugs: ['wimpernlifting', 'augenbraunlifting', 'lifting-kombi'],
    displayName: 'Liftings',
    description: 'Wimpern- und Augenbraunlifting'
  },
  feinschliff: {
    category: 'extras',
    treatmentSlugs: ['augenbrauen-zupfen', 'augenbrauen-faerben', 'shellac-naegel'],
    displayName: 'Feinschliff',
    description: 'Augenbrauen und Nagelpflege'
  }
} as const;

export type ServiceParam = keyof typeof SERVICE_MAPPING;

/**
 * Get service mapping for a specific service parameter.
 */
export function getServiceMapping(serviceParam: string): ServiceMapping | null {
  return SERVICE_MAPPING[serviceParam as ServiceParam] || null;
}

/**
 * Check if a service parameter is valid.
 */
export function isValidServiceParam(serviceParam: string): serviceParam is ServiceParam {
  return serviceParam in SERVICE_MAPPING;
}

/**
 * Get all valid service parameters.
 */
export function getValidServiceParams(): ServiceParam[] {
  return Object.keys(SERVICE_MAPPING) as ServiceParam[];
}

/**
 * Get display name for a service parameter.
 */
export function getServiceDisplayName(serviceParam: string): string {
  const mapping = getServiceMapping(serviceParam);
  return mapping?.displayName || serviceParam;
}

/**
 * Get description for a service parameter.
 */
export function getServiceDescription(serviceParam: string): string | undefined {
  const mapping = getServiceMapping(serviceParam);
  return mapping?.description;
}

/**
 * Get category for a service parameter.
 */
export function getServiceCategory(serviceParam: string): string | null {
  const mapping = getServiceMapping(serviceParam);
  return mapping?.category || null;
}

/**
 * Get treatment slugs for a service parameter.
 */
export function getServiceTreatmentSlugs(serviceParam: string): readonly string[] {
  const mapping = getServiceMapping(serviceParam);
  return mapping?.treatmentSlugs || [];
}

/**
 * Find service parameter by treatment slug.
 */
export function findServiceByTreatmentSlug(treatmentSlug: string): ServiceParam | null {
  for (const [serviceParam, mapping] of Object.entries(SERVICE_MAPPING)) {
    if ((mapping.treatmentSlugs as readonly string[]).includes(treatmentSlug)) {
      return serviceParam as ServiceParam;
    }
  }
  return null;
}

/**
 * Get all service mappings as an array.
 */
export function getAllServiceMappings(): Array<{ param: ServiceParam; mapping: ServiceMapping }> {
  return Object.entries(SERVICE_MAPPING).map(([param, mapping]) => ({
    param: param as ServiceParam,
    mapping
  }));
}