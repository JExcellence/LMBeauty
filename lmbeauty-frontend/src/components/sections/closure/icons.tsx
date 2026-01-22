import React from 'react';

interface IconProps {
  className?: string;
}

/**
 * Calendar with heart icon for closure section header
 */
export const CalendarHeartIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M12 14l1.5 1.5L12 17l-1.5-1.5L12 14z" fill="currentColor" stroke="none" />
    <path d="M12 14c-.5-.5-1.5-1-2.5 0s-.5 2 0 2.5l2.5 2.5 2.5-2.5c.5-.5.5-2 0-2.5s-2-.5-2.5 0z" />
  </svg>
);

/**
 * Calendar icon for CTA button
 */
export const CalendarIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="9" y1="14" x2="9" y2="14.01" />
    <line x1="12" y1="14" x2="12" y2="14.01" />
    <line x1="15" y1="14" x2="15" y2="14.01" />
    <line x1="9" y1="17" x2="9" y2="17.01" />
    <line x1="12" y1="17" x2="12" y2="17.01" />
  </svg>
);

/**
 * Arrow right icon for secondary link
 */
export const ArrowRightIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

/**
 * Star icon for footer accent
 */
export const StarIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
  </svg>
);

export default {
  CalendarHeartIcon,
  CalendarIcon,
  ArrowRightIcon,
  StarIcon,
};
