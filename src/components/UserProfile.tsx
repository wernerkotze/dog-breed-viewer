import { useAuthStore } from '../store/authStore';

export function UserProfile() {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  return (
    <div className="flex items-center space-x-3">
      {/* User Avatar */}
      <div className="relative">
        <img
          src={user.image}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-8 h-8 rounded-full border-2 border-gray-600"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=374151&color=fff&size=32`;
          }}
        />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></div>
      </div>

      {/* User Info */}
      <div className="hidden sm:block">
        <p className="text-sm font-medium text-white">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-xs text-gray-400">@{user.username}</p>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="text-gray-400 hover:text-white text-sm font-medium px-2 py-1 rounded transition-colors"
        title="Logout"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>
  );
}
