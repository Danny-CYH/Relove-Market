export function UserAvatar({ user, size = 8, className = "", imageLoading }) {
    const avatarId = `avatar-${user?.id || "default"}`;
    const isLoading = imageLoading[avatarId] !== false;

    return (
        <div className={`relative w-${size} h-${size} ${className}`}>
            {user?.avatar ? (
                <>
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                        </div>
                    )}
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className={`w-full h-full rounded-full object-cover ${
                            isLoading ? "opacity-0" : "opacity-100"
                        } transition-opacity`}
                        onLoad={() => handleImageLoad(avatarId)}
                        onError={() => handleImageError(avatarId)}
                    />
                </>
            ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                        {user?.name?.charAt(0) || "U"}
                    </span>
                </div>
            )}
        </div>
    );
}
