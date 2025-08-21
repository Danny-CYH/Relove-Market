import React, { useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import Carousel from "react-multi-carousel";

import "react-multi-carousel/lib/styles.css";

import { ProductCard } from "./ProductCard";

function Carousel_ProductData({ productData }) {
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 1024 },
            items: 4,
        },
        desktop: {
            breakpoint: { max: 1024, min: 768 },
            items: 3,
        },
        tablet: {
            breakpoint: { max: 768, min: 464 },
            items: 1,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
        },
    };

    const carouselRef = useRef();

    const goToPrevious = () => {
        carouselRef.current?.previous();
    };

    const goToNext = () => {
        carouselRef.current?.next();
    };
    return (
        <>
            <div className="w-full mt-10 px-4 py-4 relative">
                <div className="flex items-center justify-between">
                    <h2 className="absolute -top-2 left-4 md:left-16 text-2xl font-semibold text-green-900">
                        Flash Sale
                    </h2>
                    <div className="absolute -top-4 right-2 md:right-16 flex gap-2 p-2 z-10">
                        <button
                            onClick={goToPrevious}
                            className="bg-slate-700 text-white p-2 px-4 hover:bg-gray-400"
                        >
                            <FaArrowLeft />
                        </button>
                        <button
                            onClick={goToNext}
                            className="bg-slate-700 text-white p-2 px-4 hover:bg-gray-400"
                        >
                            <FaArrowRight />
                        </button>
                    </div>
                </div>
                <Carousel
                    ref={carouselRef}
                    responsive={responsive}
                    infinite={true}
                    autoPlay={true}
                    autoPlaySpeed={5000}
                    arrows={false}
                    renderButtonGroupOutside={true}
                >
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                </Carousel>
            </div>
        </>
    );
}

export default Carousel_ProductData;
