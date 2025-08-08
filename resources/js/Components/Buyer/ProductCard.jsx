import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Typography,
} from "@material-tailwind/react";
import { FaStar } from "react-icons/fa";

export function ProductCard() {
    return (
        <Card className="w-full md:w-96 max-w-sm md:max-w-md lg:max-w-lg mx-auto my-6 shadow-md hover:shadow-xl transition-shadow duration-300">
            <CardHeader
                floated={false}
                className="relative h-64 overflow-hidden"
            >
                <img
                    src="../image/apple_watch.jpg"
                    alt="Apple Watch"
                    className="w-full h-full object-cover"
                />
                {/* Sale badge */}
                <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 text-sm rounded shadow">
                    SALE
                </div>
            </CardHeader>

            <CardBody>
                <Typography
                    variant="h5"
                    color="blue-gray"
                    className="mb-1 font-semibold"
                >
                    Apple Watch Series 7 (GPS)
                </Typography>
                <Typography variant="small" color="gray" className="mb-3">
                    Aluminium Case – Starlight Sport Band
                </Typography>

                {/* Rating & Stock */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                        {[...Array(4)].map((_, i) => (
                            <FaStar
                                key={i}
                                className="text-yellow-400 text-sm"
                            />
                        ))}
                        <FaStar className="text-gray-300 text-sm" />
                        <span className="text-xs text-gray-500 ml-1">
                            (128)
                        </span>
                    </div>
                    <span className="text-sm text-green-600 font-medium">
                        In Stock
                    </span>
                </div>

                {/* Price */}
                <div className="text-xl font-bold text-green-700">
                    RM 200.00
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
