import type { LoaderProps } from '../types/dog';

export function Loader({ className = '', size = 'md' }: LoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`animate-spin rounded-full border-b-2 border-blue-500 ${sizeClasses[size]}`}
      />
    </div>
  );
}
