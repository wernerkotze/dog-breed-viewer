import type { ErrorBannerProps } from '../types/dog';

export function ErrorBanner({ error, onRetry, className = '' }: ErrorBannerProps) {
  return (
    <div className={`bg-red-900 border border-red-700 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-red-200">
            Something went wrong
          </h3>
          <p className="mt-1 text-sm text-red-300">
            {error}
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={onRetry}
            className="bg-red-800 hover:bg-red-700 text-red-200 hover:text-white px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
