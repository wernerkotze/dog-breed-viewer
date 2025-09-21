import { fetchJson } from '../utils/http';
import type { BreedsApiResponse, ImagesApiResponse } from '../types/dog';

const BASE_URL = 'https://dog.ceo/api';

// Cache for breeds list (since it doesn't change often)
let breedsCache: string[] | null = null;
let breedsCacheTimestamp: number | null = null;
const BREEDS_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch all available dog breeds from the API
 * Implements caching to reduce API calls since breeds don't change frequently
 */
export async function fetchBreeds(): Promise<string[]> {
  // Check if we have valid cached data
  if (
    breedsCache && 
    breedsCacheTimestamp && 
    Date.now() - breedsCacheTimestamp < BREEDS_CACHE_DURATION
  ) {
    return breedsCache;
  }

  try {
    const response = await fetchJson<BreedsApiResponse>(
      `${BASE_URL}/breeds/list/all`,
      {},
      { maxAttempts: 3, baseDelay: 1000 }
    );

    if (response.status !== 'success') {
      throw new Error('API returned unsuccessful status');
    }

    // Extract only top-level breeds (excluding sub-breeds as per requirements)
    const breeds = Object.keys(response.message).sort();
    
    // Update cache
    breedsCache = breeds;
    breedsCacheTimestamp = Date.now();
    
    return breeds;
  } catch (error) {
    // Clear cache on error to ensure fresh data on retry
    breedsCache = null;
    breedsCacheTimestamp = null;
    throw error;
  }
}

/**
 * Fetch 3 random images for a specific breed
 * @param breed - The breed name (must be a valid breed from fetchBreeds)
 */
export async function fetchBreedImages(breed: string): Promise<string[]> {
  if (!breed || typeof breed !== 'string') {
    throw new Error('Breed name is required and must be a string');
  }

  try {
    const response = await fetchJson<ImagesApiResponse>(
      `${BASE_URL}/breed/${breed.toLowerCase()}/images/random/3`,
      {},
      { maxAttempts: 3, baseDelay: 1000 }
    );

    if (response.status !== 'success') {
      throw new Error('API returned unsuccessful status');
    }

    if (!Array.isArray(response.message)) {
      throw new Error('Invalid response format: expected array of image URLs');
    }

    return response.message;
  } catch (error) {
    throw error;
  }
}

/**
 * Clear the breeds cache (useful for testing or manual refresh)
 */
export function clearBreedsCache(): void {
  breedsCache = null;
  breedsCacheTimestamp = null;
}

/**
 * Check if breeds are currently cached
 */
export function isBreedsCache(): boolean {
  return breedsCache !== null && 
         breedsCacheTimestamp !== null && 
         Date.now() - breedsCacheTimestamp < BREEDS_CACHE_DURATION;
}
