// User Types
export type UserRole = 'USER' | 'ADMIN';

export interface OAuthAccount {
  provider: string;
  providerId: string;
  email?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  oauthAccounts: OAuthAccount[];
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Header Types - Premium Header redesign
export * from './header';

// API Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
}

// Auth Types
export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

// Treatment History Types
export interface TreatmentHistory {
  id: string;
  userId: string;
  treatmentId: string;
  treatmentName: string;
  completedAt: Date;
  notes?: string;
  staffMember?: string;
}

// Appointment Types
export interface Appointment {
  id: string;
  userId: string;
  treatmentId: string;
  treatmentName: string;
  scheduledDate: Date;
  scheduledTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

// Product Purchase Types
export interface ProductPurchase {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productImageUrl?: string;
  purchasedAt: Date;
}

// Care Tip Types
export interface CareTip {
  id: string;
  title: string;
  content: string;
  icon?: string;
  relevantTreatments?: string[];
}
