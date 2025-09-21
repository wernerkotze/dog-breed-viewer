import { fetchJson } from '../utils/http';
import type { LoginCredentials, AuthResponse, User } from '../types/auth';

const BASE_URL = 'https://dummyjson.com/auth';

/**
 * Login user with username and password
 * @param credentials - Login credentials (username, password, optional expiresInMins)
 * @returns Promise<AuthResponse> - User data with tokens
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await fetchJson<AuthResponse>(
      `${BASE_URL}/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          expiresInMins: credentials.expiresInMins || 60, // Default 60 minutes
        }),
        // Remove credentials: 'include' to avoid CORS issues
      },
      { maxAttempts: 2, baseDelay: 1000 } // Shorter retry for auth
    );

    // Store tokens in localStorage for persistence
    if (response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken);
    }
    if (response.refreshToken) {
      localStorage.setItem('refreshToken', response.refreshToken);
    }

    return response;
  } catch (error) {
    // Clear any existing tokens on login failure
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    throw error;
  }
}

/**
 * Get current authenticated user
 * @returns Promise<User> - Current user data
 */
export async function getCurrentUser(): Promise<User> {
  const accessToken = localStorage.getItem('accessToken');
  
  if (!accessToken) {
    throw new Error('No access token found');
  }

  try {
    const response = await fetchJson<User>(
      `${BASE_URL}/me`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      },
      { maxAttempts: 2, baseDelay: 1000 }
    );

    return response;
  } catch (error) {
    // If token is invalid, clear it
    if (error instanceof Error && error.message.includes('401')) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    throw error;
  }
}

/**
 * Refresh the access token using refresh token
 * @returns Promise<{accessToken: string, refreshToken: string}> - New tokens
 */
export async function refreshAccessToken(): Promise<{ accessToken: string; refreshToken: string }> {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    throw new Error('No refresh token found');
  }

  try {
    const response = await fetchJson<{ accessToken: string; refreshToken: string }>(
      `${BASE_URL}/refresh`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken,
          expiresInMins: 60, // 1 hour
        }),
      },
      { maxAttempts: 2, baseDelay: 1000 }
    );

    // Update stored tokens
    if (response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken);
    }
    if (response.refreshToken) {
      localStorage.setItem('refreshToken', response.refreshToken);
    }

    return response;
  } catch (error) {
    // If refresh fails, clear all tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    throw error;
  }
}

/**
 * Logout user and clear tokens
 */
export function logout(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

/**
 * Check if user has valid tokens
 * @returns boolean - True if tokens exist
 */
export function hasValidTokens(): boolean {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  return !!(accessToken && refreshToken);
}

/**
 * Get stored access token
 * @returns string | null - Access token or null if not found
 */
export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken');
}
