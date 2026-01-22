// Premium Header Types for LMBeauty redesign

export type HeaderVariant = 'minimal' | 'full' | 'studio-mode';
export type UserState = 'guest' | 'authenticated' | 'member';

export interface HeaderProps {
  variant?: HeaderVariant;
  showSidebar?: boolean;
  userState?: UserState;
  currentSection?: string;
  className?: string;
}

export interface NavigationState {
  activeSection: string;
  sidebarOpen: boolean;
  userMenuOpen: boolean;
  mobileMenuOpen: boolean;
  scrollPosition: number;
  lastInteraction: number;
}

export interface UserContext {
  isAuthenticated: boolean;
  profile?: {
    name: string;
    nextAppointment?: {
      id: string;
      date: Date;
      time: string;
      service: string;
    };
    loyaltyStatus: 'new' | 'regular' | 'vip';
    preferences: {
      preferredServices: string[];
      communicationPreferences: {
        email: boolean;
        sms: boolean;
        push: boolean;
      };
    };
  };
  notifications: Array<{
    id: string;
    type: 'appointment' | 'promotion' | 'reminder';
    message: string;
    timestamp: Date;
    read: boolean;
  }>;
}

export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  suffixIcon?: string;
  sections?: NavigationSection[];
}

export interface NavigationSection {
  title: string;
  description: string;
  links: NavigationLink[];
}

export interface NavigationLink {
  label: string;
  href: string;
  icon?: string;
  description?: string;
  subtle?: string;
}