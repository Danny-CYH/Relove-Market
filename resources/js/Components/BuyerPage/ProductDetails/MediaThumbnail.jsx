export function MediaThumbnail({ src, isSelected, onClick, index }) {
    return (
        <button
            onClick={onClick}
            className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden ${
                isSelected
                    ? "border-blue-500"
                    : "border-gray-200 hover:border-gray-300"
            }`}
        >
            <img
                src={src}
                alt={`thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
            />
        </button>
    );
}
