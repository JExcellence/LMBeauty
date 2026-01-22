const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  language?: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  hasPassword?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: any;
}

// Traditional login/register
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const apiResponse: ApiResponse<AuthResponse> = await response.json();
  
  if (!apiResponse.success) {
    throw new Error(apiResponse.error || apiResponse.message);
  }

  return apiResponse.data;
}

export async function register(userData: {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  acceptTerms: boolean;
}): Promise<AuthResponse> {
  const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const apiResponse: ApiResponse<AuthResponse> = await response.json();
  
  if (!apiResponse.success) {
    throw new Error(apiResponse.error || apiResponse.message);
  }

  return apiResponse.data;
}

// OAuth URLs
export async function getOAuthUrl(provider: 'google' | 'instagram' | 'facebook' | 'apple', state = 'login'): Promise<string> {
  const response = await fetch(`${BACKEND_URL}/api/oauth/${provider}/url?state=${state}`);
  const apiResponse: ApiResponse<string> = await response.json();
  
  if (!apiResponse.success) {
    throw new Error(apiResponse.error || apiResponse.message);
  }

  return apiResponse.data;
}

// OAuth callback (handled by your Next.js API route)
export async function handleOAuthCallback(provider: string, code: string, state?: string): Promise<AuthResponse> {
  const response = await fetch(`/api/oauth/${provider}/callback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, state }),
  });

  const authResponse: AuthResponse = await response.json();
  
  if (!authResponse.success) {
    throw new Error(authResponse.error || authResponse.message);
  }

  return authResponse;
}

// Token management
export async function refreshToken(refreshToken: string): Promise<AuthResponse> {
  const response = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  const apiResponse: ApiResponse<AuthResponse> = await response.json();
  
  if (!apiResponse.success) {
    throw new Error(apiResponse.error || apiResponse.message);
  }

  return apiResponse.data;
}

export async function logout(refreshToken: string): Promise<void> {
  await fetch(`${BACKEND_URL}/api/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });
}

export async function getCurrentUser(accessToken: string): Promise<User> {
  const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const apiResponse: ApiResponse<AuthResponse> = await response.json();
  
  if (!apiResponse.success || !apiResponse.data.user) {
    throw new Error(apiResponse.error || 'User not found');
  }

  return apiResponse.data.user;
}