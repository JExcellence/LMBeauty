/**
 * Extras Section Types
 * Secondary services positioned as optional add-ons
 */

export interface ExtraService {
  id: string;
  title: string;
  description: string;
  bookingUrl: string;
}

export interface ServiceGroup {
  id: string;
  label: string;
  services: ExtraService[];
}

export interface ExtrasSectionProps {
  headlinePre?: string;
  headlineEmphasis?: string;
  headlinePost?: string;
  subline?: string;
  stylistNote?: string;
  serviceGroups?: ServiceGroup[];
  ctaText?: string;
  ctaUrl?: string;
}
