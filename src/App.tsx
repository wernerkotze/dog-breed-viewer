import { useEffect, useState } from 'react';
import { useDogStore } from './store/dogStore';
import { useAuthStore, initializeAuth } from './store/authStore';
import { BreedSelector } from './components/BreedSelector';
import { ImageGrid } from './components/ImageGrid';
import { LoginForm } from './components/LoginForm';
import { UserProfile } from './components/UserProfile';

function App() {
  const { fetchBreeds, breedsStatus, selectedBreed } = useDogStore();
  const { isAuthenticated } = useAuthStore();
  const [showLogin, setShowLogin] = useState(true);

  // Initialize auth and fetch breeds on app load
  useEffect(() => {
    const initialize = async () => {
      // Cool console log (only show once)
      if (!(window as any).__DOG_BREED_VIEWER_INITIALIZED__) {
        (window as any).__DOG_BREED_VIEWER_INITIALIZED__ = true;
        
        console.log(
          '%c🐕 Dog Breed Viewer %c🚀',
          'color: #60a5fa; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);',
          'color: #fbbf24; font-size: 20px;'
        );
        console.log(
          '%cWelcome to the Dog Breed Viewer! 🎉\n' +
          '🔧 Built with React, TypeScript & Tailwind CSS\n' +
          '🌐 Powered by Dog CEO API\n' +
          '⚡ Features: Caching, Error Handling, Authentication & More!\n' +
          '🧪 Includes Unit Tests with Vitest\n' +
          '📱 Fully Responsive Design\n\n' +
          '🐾 Discover over 100+ dog breeds with beautiful photos!',
          'color: #34d399; font-size: 14px; line-height: 1.6; font-family: "Courier New", monospace;'
        );
        console.log(
          '%c💡 Pro Tip: Try the "Test API Endpoints" button in the footer!',
          'color: #a78bfa; font-size: 12px; font-style: italic;'
        );
      }
      
      await initializeAuth();
      fetchBreeds();
    };
    initialize();
  }, [fetchBreeds]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="caveat-header text-xl sm:text-2xl lg:text-3xl text-white">
                <span className="hidden sm:inline">Dog Breed Viewer</span>
                <span className="sm:hidden">Dog Breed Viewer</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Status */}
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

              {/* Auth Section */}
              {isAuthenticated ? (
                <UserProfile />
              ) : (
                // Only show header button when in main app (not on login screen)
                !showLogin && (
                  <button
                    onClick={() => setShowLogin(true)}
                    className="text-sm text-blue-400 hover:text-blue-300 font-medium px-3 py-1 rounded border border-blue-400 hover:border-blue-300 transition-colors"
                  >
                    Sign In
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {showLogin && !isAuthenticated ? (
          /* Login Form */
          <div className="max-w-md mx-auto">
            <LoginForm 
              onContinueWithoutSignIn={() => {
                setShowLogin(false);
              }}
            />
          </div>
        ) : (
          /* Main App Content */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Sidebar - Breed Selector */}
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-medium text-white mb-4">
                  Select a Breed
                </h2>
                <BreedSelector />
              </div>
            </aside>

            {/* Main Content Area - Images */}
            <section className="lg:col-span-8 xl:col-span-9">
              <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4 sm:p-6">
                <ImageGrid />
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
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
              <button
                onClick={() => {
                  // Test the API endpoints
                  const testWindow = window.open('', '_blank');
                  if (testWindow) {
                    testWindow.document.write(`
                      <html>
                        <head><title>Dog API Test</title></head>
                        <body style="font-family: Arial, sans-serif; padding: 20px; background: #1f2937; color: white;">
                          <h2>Dog CEO API Test Links</h2>
                          <div style="margin: 20px 0;">
                            <h3>Breeds List:</h3>
                            <a href="https://dog.ceo/api/breeds/list/all" target="_blank" style="color: #60a5fa;">
                              https://dog.ceo/api/breeds/list/all
                            </a>
                          </div>
                          <div style="margin: 20px 0;">
                            <h3>Sample Image Requests:</h3>
                            <a href="https://dog.ceo/api/breed/labrador/images/random/3" target="_blank" style="color: #60a5fa; display: block; margin: 5px 0;">
                              https://dog.ceo/api/breed/labrador/images/random/3
                            </a>
                            <a href="https://dog.ceo/api/breed/golden/images/random/3" target="_blank" style="color: #60a5fa; display: block; margin: 5px 0;">
                              https://dog.ceo/api/breed/golden/images/random/3
                            </a>
                            <a href="https://dog.ceo/api/breed/husky/images/random/3" target="_blank" style="color: #60a5fa; display: block; margin: 5px 0;">
                              https://dog.ceo/api/breed/husky/images/random/3
                            </a>
                          </div>
                        </body>
                      </html>
                    `);
                  }
                }}
                className="text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
              >
                Test API Endpoints
              </button>
            </div>
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
