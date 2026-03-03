import { Minus, Plus } from "lucide-react";

export function QuantitySelector({ quantity, onIncrease, onDecrease, max }) {
    return (
        <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                    onClick={onDecrease}
                    disabled={quantity <= 1}
                    className="px-4 py-2 hover:bg-gray-100 text-black transition-colors disabled:opacity-50"
                >
                    <Minus size={16} />
                </button>
                <span className="w-12 text-center font-medium text-black">
                    {quantity}
                </span>
                <button
                    onClick={onIncrease}
                    disabled={quantity >= max}
                    className="px-4 py-2 hover:bg-gray-100 text-black transition-colors disabled:opacity-50"
                >
                    <Plus size={16} />
                </button>
            </div>
            {max <= 5 && max > 0 && (
                <span className="text-sm text-orange-600 font-medium">
                    Sisa {max} buah!
                </span>
            )}
        </div>
    );
}
