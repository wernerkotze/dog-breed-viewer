import { create } from 'zustand';
import { login as apiLogin, getCurrentUser, refreshAccessToken, logout as apiLogout, hasValidTokens } from '../services/authApi';
import type { AuthStore, LoginCredentials } from '../types/auth';

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Auth state
  user: null,
  isAuthenticated: false,
  authStatus: 'idle',
  authError: null,

  // Actions
  login: async (credentials: LoginCredentials) => {
    const state = get();
    
    // Don't login if already loading
    if (state.authStatus === 'loading') return;
    
    set({ authStatus: 'loading', authError: null });
    
    try {
      const authResponse = await apiLogin(credentials);
      
      // Extract user data (exclude tokens for security)
      const user = {
        id: authResponse.id,
        username: authResponse.username,
        email: authResponse.email,
        firstName: authResponse.firstName,
        lastName: authResponse.lastName,
        gender: authResponse.gender,
        image: authResponse.image,
      };
      
      set({ 
        user,
        isAuthenticated: true,
        authStatus: 'success',
        authError: null 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      set({ 
        user: null,
        isAuthenticated: false,
        authStatus: 'error',
        authError: errorMessage 
      });
    }
  },

  logout: () => {
    apiLogout();
    set({ 
      user: null,
      isAuthenticated: false,
      authStatus: 'idle',
      authError: null 
    });
  },

  getCurrentUser: async () => {
    const state = get();
    
    // Don't fetch if already loading or no tokens
    if (state.authStatus === 'loading' || !hasValidTokens()) return;
    
    set({ authStatus: 'loading', authError: null });
    
    try {
      const user = await getCurrentUser();
      
      set({ 
        user,
        isAuthenticated: true,
        authStatus: 'success',
        authError: null 
      });
    } catch (error) {
      // If getting current user fails, try to refresh token
      try {
        await get().refreshToken();
        // After refresh, try getting user again
        const user = await getCurrentUser();
        set({ 
          user,
          isAuthenticated: true,
          authStatus: 'success',
          authError: null 
        });
      } catch (refreshError) {
        // Both failed, logout
        get().logout();
      }
    }
  },

  refreshToken: async () => {
    try {
      await refreshAccessToken();
      // Token refreshed successfully, no need to update state
      // The tokens are stored in localStorage by the API function
    } catch (error) {
      // Refresh failed, logout user
      get().logout();
      throw error;
    }
  },
}));

// Initialize auth state on app start
export const initializeAuth = async () => {
  const authStore = useAuthStore.getState();
  
  if (hasValidTokens()) {
    try {
      await authStore.getCurrentUser();
    } catch (error) {
      // If initialization fails, user will need to login again
      console.warn('Failed to initialize auth:', error);
    }
  }
};
