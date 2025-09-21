import { create } from 'zustand';
import { fetchBreeds, fetchBreedImages } from '../services/dogApi';
import type { DogStore } from '../types/dog';

export const useDogStore = create<DogStore>((set, get) => ({
  // Breeds state
  breeds: [],
  breedsStatus: 'idle',
  breedsError: null,
  
  // Selected breed and images
  selectedBreed: null,
  images: [],
  imagesStatus: 'idle',
  imagesError: null,
  
  // Actions
  fetchBreeds: async () => {
    const state = get();
    
    // Don't fetch if already loading
    if (state.breedsStatus === 'loading') return;
    
    set({ breedsStatus: 'loading', breedsError: null });
    
    try {
      const breeds = await fetchBreeds();
      set({ 
        breeds, 
        breedsStatus: 'success',
        breedsError: null 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch breeds';
      set({ 
        breedsStatus: 'error',
        breedsError: errorMessage,
        breeds: [] 
      });
    }
  },
  
  setSelectedBreed: (breed: string | null) => {
    const state = get();
    
    // If selecting the same breed, don't do anything
    if (state.selectedBreed === breed) return;
    
    set({ 
      selectedBreed: breed,
      images: [],
      imagesStatus: 'idle',
      imagesError: null 
    });
    
    // Automatically fetch images for the selected breed
    if (breed) {
      get().fetchImagesForBreed(breed);
    }
  },
  
  fetchImagesForBreed: async (breed: string) => {
    const state = get();
    
    // Don't fetch if already loading images for this breed
    if (state.imagesStatus === 'loading' && state.selectedBreed === breed) return;
    
    set({ 
      imagesStatus: 'loading', 
      imagesError: null,
      selectedBreed: breed 
    });
    
    try {
      const images = await fetchBreedImages(breed);
      
      // Only update if this is still the selected breed (prevents race conditions)
      const currentState = get();
      if (currentState.selectedBreed === breed) {
        set({ 
          images, 
          imagesStatus: 'success',
          imagesError: null 
        });
      }
    } catch (error) {
      const currentState = get();
      // Only update error if this is still the selected breed
      if (currentState.selectedBreed === breed) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch images';
        set({ 
          imagesStatus: 'error',
          imagesError: errorMessage,
          images: [] 
        });
      }
    }
  },
  
  retryFetchBreeds: async () => {
    await get().fetchBreeds();
  },
  
  retryFetchImages: async () => {
    const state = get();
    if (state.selectedBreed) {
      await get().fetchImagesForBreed(state.selectedBreed);
    }
  },
}));
