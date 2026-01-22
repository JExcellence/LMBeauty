/**
 * Services Section Type Definitions
 * 
 * Comprehensive types for the psychologically-optimized services showcase
 */

export interface ServicePrice {
  amount: number;
  prefix?: string; // "ab"
  currency: string; // "€"
}

export interface ServiceImage {
  src: string | null;
  alt: string;
}

export type ServiceBadge = 'popular' | 'premium' | 'new' | 'refill';

export interface RefillPrice {
  weeks: string;
  price: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  personaTag: string; // Identity-based label
  description: string;
  price: ServicePrice;
  duration: number; // minutes
  image?: ServiceImage; // Optional - no fallback images
  badge?: ServiceBadge;
  bookingUrl: string;
  // Extended details for expanded view
  details?: {
    refillPrices?: RefillPrice[];
    idealFor?: string[];
    includes?: string[];
  };
}

export interface ServiceTestimonial {
  quote: string;
  author: string;
  service: string;
}

export interface ServicesSectionProps {
  headline?: string;
  subheadline?: string;
  services?: Service[];
  testimonial?: ServiceTestimonial;
  showStyleQuiz?: boolean;
  showAllServicesLink?: boolean;
}

export interface ServiceCardProps {
  service: Service;
  index?: number;
  onBook?: (serviceId: string) => void;
}

export interface SectionHeaderProps {
  headline: string;
  subheadline: string;
}

export interface SocialProofBannerProps {
  testimonial: ServiceTestimonial;
}

export interface DecisionHelperProps {
  showStyleQuiz?: boolean;
  showAllServicesLink?: boolean;
}
