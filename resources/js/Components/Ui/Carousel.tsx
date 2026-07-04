import { useRef, useState, useCallback, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { ProductCard } from "@/Components/Ui/ProductCard";
import { FeaturedProductsLoading } from "@/Components/BuyerPage/HomePage/FeaturedProductsLoading";
import { NoFeaturedProducts } from "@/Components/BuyerPage/HomePage/NoFeaturedProducts";

export default function Carousel({ carouselProducts, loadingFeatured, title }) {
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

    const carouselIntervalRef = useRef(null);
    const carouselContainerRef = useRef(null);

    const itemsPerSlide = 4; // Number of products to show per slide

    const nextCarouselSlide = () => {
        if (carouselProducts.length <= itemsPerSlide) return;

        setCurrentCarouselIndex((prevIndex) => {
            const nextIndex = prevIndex + itemsPerSlide;
            if (nextIndex >= carouselProducts.length) {
                // Smooth transition to beginning
                setTimeout(() => {
                    setCurrentCarouselIndex(0);
                }, 300);
                return carouselProducts.length - itemsPerSlide;
            }
            return nextIndex;
        });
    };

    const prevCarouselSlide = () => {
        if (carouselProducts.length <= itemsPerSlide) return;

        setCurrentCarouselIndex((prevIndex) => {
            const prevIndexValue = prevIndex - itemsPerSlide;
            if (prevIndexValue < 0) {
                // Smooth transition to end
                setTimeout(() => {
                    setCurrentCarouselIndex(
                        carouselProducts.length - itemsPerSlide,
                    );
                }, 300);
                return 0;
            }
            return prevIndexValue;
        });
    };

    const startAutoPlay = useCallback(() => {
        if (carouselProducts.length <= itemsPerSlide) return;

        clearInterval(carouselIntervalRef.current);
        carouselIntervalRef.current = setInterval(() => {
            setCurrentCarouselIndex((prevIndex) => {
                const nextIndex = prevIndex + itemsPerSlide;
                if (nextIndex >= carouselProducts.length) {
                    // Smooth transition to beginning
                    setTimeout(() => {
                        setCurrentCarouselIndex(0);
                    }, 300);
                    return carouselProducts.length - itemsPerSlide;
                }
                return nextIndex;
            });
        }, 5000);
    }, [carouselProducts.length]);

    const stopAutoPlay = () => {
        clearInterval(carouselIntervalRef.current);
    };

    useEffect(() => {
        if (carouselProducts.length > 1 && isAutoPlaying) {
            startAutoPlay();
        }
        return () => {
            stopAutoPlay();
        };
    }, [carouselProducts.length, isAutoPlaying, startAutoPlay]);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                    {title}
                </h2>
                <div className="flex items-center gap-3 mt-3 md:mt-0">
                    <Link
                        href={route("relove-market.shopping")}
                        className="text-green-600 hover:text-green-700 flex items-center text-sm font-medium"
                    >
                        View all <FaArrowRight className="ml-1 text-xs" />
                    </Link>
                </div>
            </div>

            {/* Loading State */}
            {loadingFeatured && <FeaturedProductsLoading />}

            {/* No Featured Products State */}
            {!loadingFeatured && carouselProducts.length === 0 && (
                <NoFeaturedProducts />
            )}

            {/* Infinite Carousel */}
            {!loadingFeatured && carouselProducts.length > 0 && (
                <div className="relative">
                    {/* Carousel Container */}
                    <div
                        ref={carouselContainerRef}
                        className="overflow-hidden rounded-xl"
                    >
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(-${
                                    currentCarouselIndex *
                                    (100 / Math.min(4, carouselProducts.length))
                                }%)`,
                            }}
                        >
                            {carouselProducts.map((product, index) => (
                                <div
                                    key={`${product.product_id}-${index}`}
                                    className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 px-2 sm:px-3"
                                >
                                    <ProductCard
                                        key={product.product_id}
                                        product={product}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons - Only show if there are more than 4 products */}
                    {carouselProducts.length > 4 && (
                        <>
                            <button
                                onClick={prevCarouselSlide}
                                className="absolute -left-3 sm:-left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 p-2 sm:p-3 rounded-full shadow-lg border border-gray-200 transition-all z-10"
                                aria-label="Previous product"
                            >
                                <FaChevronLeft className="text-gray-700 w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                                onClick={nextCarouselSlide}
                                className="absolute -right-3 sm:-right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 p-2 sm:p-3 rounded-full shadow-lg border border-gray-200 transition-all z-10"
                                aria-label="Next product"
                            >
                                <FaChevronRight className="text-gray-700 w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
