// Dog CEO API types
export interface BreedsApiResponse {
  message: Record<string, string[]>;
  status: string;
}

export interface ImagesApiResponse {
  message: string[];
  status: string;
}

// App types
export interface DogStore {
  // Breeds state
  breeds: string[];
  breedsStatus: 'idle' | 'loading' | 'success' | 'error';
  breedsError: string | null;
  
  // Selected breed and images
  selectedBreed: string | null;
  images: string[];
  imagesStatus: 'idle' | 'loading' | 'success' | 'error';
  imagesError: string | null;
  
  // Track breeds with image issues
  breedsWithImageIssues: Set<string>;
  
  // Actions
  fetchBreeds: () => Promise<void>;
  setSelectedBreed: (breed: string | null) => void;
  fetchImagesForBreed: (breed: string) => Promise<void>;
  retryFetchBreeds: () => Promise<void>;
  retryFetchImages: () => Promise<void>;
  markBreedWithImageIssues: (breed: string) => void;
}

// HTTP utility types
export interface HttpError extends Error {
  status?: number;
  retryAfter?: number;
}

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

// Component prop types
export interface BreedSelectorProps {
  className?: string;
}

export interface ImageGridProps {
  className?: string;
}

export interface ErrorBannerProps {
  error: string;
  onRetry: () => void;
  className?: string;
}

export interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}
