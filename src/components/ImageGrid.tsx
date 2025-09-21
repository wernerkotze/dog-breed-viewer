import { useState, useEffect } from 'react';
import { useDogStore } from '../store/dogStore';
import type { ImageGridProps } from '../types/dog';

export function ImageGrid({ className = '' }: ImageGridProps) {
  const { 
    selectedBreed, 
    images, 
    imagesStatus, 
    imagesError, 
    retryFetchImages,
    fetchImagesForBreed,
    markBreedWithImageIssues
  } = useDogStore();

  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [imageLoadStates, setImageLoadStates] = useState<Map<string, 'loading' | 'loaded' | 'error'>>(new Map());

  // Reset error tracking when breed changes
  useEffect(() => {
    setImageErrors(new Set());
    setImageLoadStates(new Map());
  }, [selectedBreed, images]);

  const handleRefreshImages = () => {
    if (selectedBreed) {
      setImageErrors(new Set());
      setImageLoadStates(new Map());
      fetchImagesForBreed(selectedBreed);
    }
  };

  if (!selectedBreed) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <h3 className="caveat-header text-2xl sm:text-3xl text-white mb-4">
          Welcome to Dog Breed Viewer
        </h3>
        <p className="text-gray-300 max-w-md mx-auto text-sm sm:text-base px-4">
          Select a dog breed from the sidebar to view beautiful photos 
          of that breed. Discover over 100 different dog breeds!
        </p>
      </div>
    );
  }

  if (imagesStatus === 'error') {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium text-white capitalize">
            {selectedBreed} Photos
          </h3>
          <button 
            onClick={handleRefreshImages}
            className="text-sm text-blue-400 hover:text-blue-300 font-medium"
          >
            Try Again
          </button>
        </div>
        
        <div className="text-center py-12">
          <h4 className="text-lg font-medium text-white mb-2">Failed to Load Images</h4>
          <p className="text-gray-400 text-sm mb-4">{imagesError}</p>
          <button
            onClick={retryFetchImages}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Retry Loading Images
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
        <h3 className="text-lg sm:text-xl font-medium text-white capitalize">
          {selectedBreed} Photos
        </h3>
        <button 
          onClick={handleRefreshImages}
          disabled={imagesStatus === 'loading'}
          className="text-sm text-blue-400 hover:text-blue-300 font-medium self-start sm:self-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {imagesStatus === 'loading' ? 'Loading...' : 'Refresh Images'}
        </button>
      </div>

      {/* Loading State */}
      {imagesStatus === 'loading' && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading {selectedBreed} photos...</p>
        </div>
      )}

      {/* Images Grid */}
      {imagesStatus === 'success' && images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {images.map((imageUrl, index) => {
            // Create a unique key that includes the URL to force re-render on new images
            const imageKey = `${selectedBreed}-${index}-${imageUrl.split('/').pop()}`;
            const loadState = imageLoadStates.get(imageKey) || 'loading';
            const hasError = imageErrors.has(imageKey);
            
            return (
              <div 
                key={imageKey}
                className="group relative rounded-lg overflow-hidden"
                style={{ aspectRatio: '1 / 1' }}
              >
                {/* Loading placeholder */}
                {loadState === 'loading' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                )}

                {/* Error state */}
                {hasError ? (
                  <div className="w-full h-full bg-gray-700 flex flex-col items-center justify-center text-center p-4">
                    <p className="text-gray-300 text-sm mb-2 font-medium">Image Not Available</p>
                    <p className="text-gray-500 text-xs">
                      404 - Image not found on server
                    </p>
                    <button
                      onClick={() => {
                        // Try to reload the image
                        setImageErrors(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(imageKey);
                          return newSet;
                        });
                        setImageLoadStates(prev => {
                          const newMap = new Map(prev);
                          newMap.set(imageKey, 'loading');
                          return newMap;
                        });
                      }}
                      className="mt-2 text-xs text-blue-400 hover:text-blue-300"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <img
                    src={imageUrl}
                    alt={`${selectedBreed} dog ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    onLoad={() => {
                      setImageLoadStates(prev => {
                        const newMap = new Map(prev);
                        newMap.set(imageKey, 'loaded');
                        return newMap;
                      });
                    }}
                    onError={(e) => {
                      console.error('Failed to load image:', imageUrl, 'Status:', e.type);
                      
                      // Mark this breed as having image issues
                      if (selectedBreed) {
                        markBreedWithImageIssues(selectedBreed);
                      }
                      
                      setImageErrors(prev => new Set(prev).add(imageKey));
                      setImageLoadStates(prev => {
                        const newMap = new Map(prev);
                        newMap.set(imageKey, 'error');
                        return newMap;
                      });
                    }}
                  />
                )}
                
                {/* Hover Overlay - only show if image loaded successfully */}
                {loadState === 'loaded' && !hasError && (
                  <div className="absolute inset-0 transition-all duration-300 flex items-center justify-center">
                    <button
                      onClick={() => window.open(imageUrl, '_blank')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 px-3 py-1 rounded-md text-sm font-medium shadow-lg"
                    >
                      View Full Size
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {imagesStatus === 'success' && images.length === 0 && (
        <div className="text-center py-12">
          <h4 className="text-lg font-medium text-white mb-2">No Images Available</h4>
          <p className="text-gray-400 text-sm mb-4">
            No photos found for {selectedBreed}. This might be a temporary issue.
          </p>
          <button
            onClick={handleRefreshImages}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
