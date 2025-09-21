import { useDogStore } from '../store/dogStore';
import type { ImageGridProps } from '../types/dog';

export function ImageGrid({ className = '' }: ImageGridProps) {
  const { 
    selectedBreed, 
    images, 
    imagesStatus, 
    imagesError, 
    retryFetchImages,
    fetchImagesForBreed 
  } = useDogStore();

  const handleRefreshImages = () => {
    if (selectedBreed) {
      fetchImagesForBreed(selectedBreed);
    }
  };

  if (!selectedBreed) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <div className="text-6xl mb-4">🐾</div>
        <h3 className="text-xl font-medium text-white mb-2">
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
          <div className="text-4xl mb-3">⚠️</div>
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
            
            return (
              <div 
                key={imageKey}
                className="group relative rounded-lg overflow-hidden"
                style={{ aspectRatio: '1 / 1' }}
              >
                <img
                  src={imageUrl}
                  alt={`${selectedBreed} dog ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 bg-gray-700"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.error('Failed to load image:', imageUrl);
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={() => window.open(imageUrl, '_blank')}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 px-3 py-1 rounded-md text-sm font-medium shadow-lg"
                  >
                    View Full Size
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {imagesStatus === 'success' && images.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📷</div>
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
