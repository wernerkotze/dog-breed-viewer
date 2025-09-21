import { useEffect } from 'react';
import { useDogStore } from './store/dogStore';

function App() {
  const { fetchBreeds, breedsStatus, selectedBreed } = useDogStore();

  // Fetch breeds on app load
  useEffect(() => {
    fetchBreeds();
  }, [fetchBreeds]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="text-lg sm:text-xl">🐕</div>
              <h1 className="text-base sm:text-lg font-semibold text-white">
                <span className="hidden sm:inline">Dog Breed Viewer</span>
                <span className="sm:hidden">Dog Breeds</span>
              </h1>
            </div>
            <div className="text-xs sm:text-sm text-gray-300">
              {breedsStatus === 'loading' && (
                <span className="hidden sm:inline">Loading breeds...</span>
              )}
              {breedsStatus === 'loading' && (
                <span className="sm:hidden">Loading...</span>
              )}
              {breedsStatus === 'success' && selectedBreed && (
                <>
                  <span className="hidden sm:inline">Viewing: {selectedBreed}</span>
                  <span className="sm:hidden capitalize">{selectedBreed}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Sidebar - Breed Selector */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-medium text-white mb-4">
                Select a Breed
              </h2>
              {/* Breed selector component will go here */}
              <div className="text-center text-gray-400 py-6 sm:py-8">
                <div className="text-3xl sm:text-4xl mb-2">🔍</div>
                <p className="text-sm sm:text-base">Breed selector coming soon...</p>
              </div>
            </div>
          </aside>

          {/* Main Content Area - Images */}
          <section className="lg:col-span-8 xl:col-span-9">
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4 sm:p-6">
              {!selectedBreed ? (
                // Welcome state
                <div className="text-center py-12 sm:py-16">
                  <div className="text-4xl sm:text-6xl mb-4">🐾</div>
                  <h3 className="text-lg sm:text-xl font-medium text-white mb-2">
                    Welcome to Dog Breed Viewer
                  </h3>
                  <p className="text-gray-300 max-w-md mx-auto text-sm sm:text-base px-4">
                    Select a dog breed from the sidebar to view beautiful photos 
                    of that breed. Discover over 100 different dog breeds!
                  </p>
                </div>
              ) : (
                // Selected breed content
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
                    <h3 className="text-lg sm:text-xl font-medium text-white capitalize">
                      {selectedBreed} Photos
                    </h3>
                    <button 
                      className="text-sm text-blue-400 hover:text-blue-300 font-medium self-start sm:self-auto"
                      onClick={() => {/* Refresh images logic will go here */}}
                    >
                      Refresh Images
                    </button>
                  </div>
                  
                  {/* Image grid component will go here */}
                  <div className="text-center text-gray-400 py-6 sm:py-8">
                    <div className="text-3xl sm:text-4xl mb-2">📸</div>
                    <p className="text-sm sm:text-base">Image grid coming soon...</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-gray-400">
              Powered by{' '}
              <a 
                href="https://dog.ceo/dog-api/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                Dog CEO API
              </a>
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              Built with React, TypeScript & Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App
