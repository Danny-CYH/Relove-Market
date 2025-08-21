import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Typography,
} from "@material-tailwind/react";
import { FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";

export function ProductCard({ product }) {
    const { name, description, image, price, rating, stock, flashEndTime } =
        product || {};
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (!flashEndTime) return;
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(flashEndTime).getTime() - now;
            setTimeLeft(distance > 0 ? distance : 0);
        }, 1000);
        return () => clearInterval(interval);
    }, [flashEndTime]);

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
            2,
            "0"
        );
        const seconds = String(totalSeconds % 60).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    };

    return (
        <Card className="w-full max-w-xs mx-auto shadow-md hover:shadow-xl transition duration-300 rounded-xl mt-7 mb-5">
            <CardHeader
                floated={false}
                className="relative h-56 overflow-hidden rounded-t-xl"
            >
                <img
                    src={image || "../image/apple_watch.jpg"}
                    alt={name || "Product"}
                    className="w-full h-full object-cover"
                />
                {/* SALE Badge */}
                {product && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 text-sm rounded shadow">
                        SALE
                    </div>
                )}

                {/* Countdown Timer */}
                {flashEndTime && timeLeft > 0 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-3 py-1 text-sm rounded shadow font-mono">
                        {formatTime(timeLeft)}
                    </div>
                )}
            </CardHeader>

            <CardBody>
                <Typography
                    variant="h6"
                    color="blue-gray"
                    className="mb-1 font-semibold truncate"
                >
                    {name || "Apple Watch Series 7"}
                </Typography>
                <Typography
                    variant="small"
                    color="gray"
                    className="mb-3 truncate"
                >
                    {description || "Aluminium Case – Starlight Sport Band"}
                </Typography>

                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                        {[...Array(rating || 4)].map((_, i) => (
                            <FaStar
                                key={i}
                                className="text-yellow-400 text-sm"
                            />
                        ))}
                        {[...Array(5 - (rating || 4))].map((_, i) => (
                            <FaStar key={i} className="text-gray-300 text-sm" />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">
                            (128)
                        </span>
                    </div>
                    <span
                        className={`text-sm font-medium ${
                            stock ? "text-green-600" : "text-red-500"
                        }`}
                    >
                        {stock ? "In Stock" : "Out of Stock"}
                    </span>
                </div>

                <div className="text-xl font-bold text-green-700">
                    {price || "RM200.00"}
                </div>
            </CardBody>

            <CardFooter className="pt-4">
                <Button fullWidth color="blue" ripple={true}>
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
}