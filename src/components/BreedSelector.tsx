import { useState, useMemo, useCallback } from 'react';
import { useDogStore } from '../store/dogStore';
import { useDebounce } from '../hooks/useDebounce';
import type { BreedSelectorProps } from '../types/dog';

export function BreedSelector({ className = '' }: BreedSelectorProps) {
  const { breeds, breedsStatus, breedsError, selectedBreed, setSelectedBreed, retryFetchBreeds } = useDogStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debounce search term with 200ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  
  // Filter breeds based on debounced search term
  const filteredBreeds = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return breeds;
    
    const term = debouncedSearchTerm.toLowerCase().trim();
    return breeds.filter(breed => 
      breed.toLowerCase().includes(term)
    );
  }, [breeds, debouncedSearchTerm]);

  const handleBreedSelect = useCallback((breed: string) => {
    setSelectedBreed(breed);
  }, [setSelectedBreed]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  if (breedsStatus === 'error') {
    return (
      <div className={`${className}`}>
        <div className="text-center py-8">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-medium text-white mb-2">Failed to Load Breeds</h3>
          <p className="text-gray-400 text-sm mb-4">{breedsError}</p>
          <button
            onClick={retryFetchBreeds}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Search Input */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search breeds..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Loading State */}
      {breedsStatus === 'loading' && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Loading breeds...</p>
        </div>
      )}

      {/* Breeds List */}
      {breedsStatus === 'success' && (
        <>
          {/* Search Results Info */}
          {debouncedSearchTerm && (
            <div className="mb-3 text-xs text-gray-400">
              {filteredBreeds.length} breed{filteredBreeds.length !== 1 ? 's' : ''} found
              {filteredBreeds.length === 0 && ' - try a different search term'}
            </div>
          )}

          {/* Breeds List Container */}
          <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {filteredBreeds.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-3xl mb-2">🔍</div>
                <p className="text-gray-400 text-sm">No breeds found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredBreeds.map((breed) => (
                  <button
                    key={breed}
                    onClick={() => handleBreedSelect(breed)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedBreed === breed
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <span className="capitalize">{breed}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Total Count */}
          {!debouncedSearchTerm && breeds.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-400 text-center">
              {breeds.length} total breeds available
            </div>
          )}
        </>
      )}
    </div>
  );
}
