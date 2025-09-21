// Authentication types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export interface AuthStore {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  authStatus: 'idle' | 'loading' | 'success' | 'error';
  authError: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  refreshToken: () => Promise<void>;
}
