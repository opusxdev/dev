export default function Profile() {
  return (
    <div className="flex gap-4 mb-8 items-start">
      {/* Profile Picture */}
      <div className="flex-shrink-0">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-sapphire-400 flex items-center justify-center bg-gradient-to-br from-sapphire-400/20 to-sapphire-300/20">
          <img
            src="https://avatars.githubusercontent.com/u/YOUR_GITHUB_ID?v=4"
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230F52BA'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";
            }}
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-neutral-200 mb-1">opusxdev</h1>
        <p className="text-sapphire-400 text-sm mb-3">@opusxdev</p>
        <p className="text-neutral-400 text-xs leading-relaxed">
          
        </p>
      </div>
    </div>
  );
}
