import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHeart,
    faRecycle,
    faLeaf,
    faShield,
} from "@fortawesome/free-solid-svg-icons";

import { Footer } from "@/Components/Buyer/Footer";
import { Navbar } from "@/Components/Buyer/Navbar";

export default function AboutUs() {
    return (
        <div className="h-96 flex flex-col bg-white">
            <Navbar />
            <main className="flex-grow">
                <div
                    className="relative h-72 md:h-banner bg-cover bg-center w-full"
                    style={{ backgroundImage: `url('../image/about_us.jpg')` }}
                >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center min-h-52 md:h-[25rem] text-white px-4 text-center">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-light mb-2">
                            About Relove Market
                        </h1>
                        <p className="text-md px-10 font-light md:text-xl md:px-96">
                            Our mission is to give preloved items a new home and
                            reduce waste while building a community of mindful
                            consumers.
                        </p>
                    </div>
                </div>
            </main>

            {/* Story of the relove market */}
            <div className="hero h-auto md:mt-24 md:px-40">
                <div className="hero-content flex-col lg:flex-row">
                    <img
                        src="../image/story_of_us.jpg"
                        className="rounded-lg shadow-2xl mt-6 w-[20rem] md:w-[30rem] md:h-[20rem]"
                    />
                    <div className="px-5 md:px-20">
                        <h1 className="text-2xl text-center font-bold text-black md:text-5xl md:text-left">
                            The Story Of Us!
                        </h1>
                        <p className="py-6 text-black text-justify">
                            Relove Market was born from a simple idea: that one
                            person's unused items could become another's
                            treasure. We started in 2023 with a small community
                            of enthusiasts passionate about sustainability and
                            redducing waste. What began as a local exchange
                            program quickly grew into a comprehensive platform
                            where people can buy, sell, and trade preloved items
                            with confidence and ease. Today, we're pround to
                            have helped thousands of items find new homes,
                            reducing landfill waste and creating a more
                            sustainable future for all.
                        </p>
                    </div>
                </div>
            </div>

            {/* Our Values */}
            <h3 className="text-center text-2xl text-black font-bold md:px-44 md:mt-20 md:text-left">
                Our Values
            </h3>
            <div className="flex flex-col items-center mt-5 md:flex-row md:px-40 md:mt-6">
                <div className="card w-72 bg-slate-100 card-xs shadow-sm mx-5 p-4 mb-4 md:w-96">
                    <div className="card-body">
                        <FontAwesomeIcon
                            icon={faHeart}
                            className="text-green-300 text-3xl"
                        />
                        <h2 className="text-black text-center text-lg font-bold">
                            Community
                        </h2>
                        <p className="text-black text-center text-[13px]">
                            Building connections through shared values and
                            sustainable practices.
                        </p>
                    </div>
                </div>

                <div className="card w-72 bg-slate-100 card-xs shadow-sm mx-5 p-4 mb-4 md:w-96">
                    <div className="card-body">
                        <FontAwesomeIcon
                            icon={faRecycle}
                            className="text-blue-500 text-3xl"
                        />
                        <h2 className="text-black text-center text-lg font-bold">
                            Sustainability
                        </h2>
                        <p className="text-black text-center text-[13px]">
                            Extending product lifecycles and reducing
                            environmental impact.
                        </p>
                    </div>
                </div>

                <div className="card w-72 bg-slate-100 card-xs shadow-sm mx-5 p-4 mb-4 md:w-96">
                    <div className="card-body">
                        <FontAwesomeIcon
                            icon={faLeaf}
                            className="text-green-700 text-3xl"
                        />
                        <h2 className="text-black text-center text-lg font-bold">
                            Mindful Consumption
                        </h2>
                        <p className="text-black text-center text-[13px]">
                            Encouraging thoughtful purchasing decisions and less
                            waste.
                        </p>
                    </div>
                </div>

                <div className="card w-72 bg-slate-100 card-xs shadow-sm mx-5 p-4 mb-4 md:w-96">
                    <div className="card-body">
                        <FontAwesomeIcon
                            icon={faShield}
                            className="text-blue-800 text-3xl"
                        />
                        <h2 className="text-black text-center text-lg font-bold">
                            Trust & Safety
                        </h2>
                        <p className="text-black text-center text-[13px]">
                            Creating a secure platform for users to exchange
                            with confidence.
                        </p>
                    </div>
                </div>
            </div>

            {/* Frequently Ask Questions */}
            <div className="bg-gray-50 mt-10 md:mt-20">
                <h3 className="text-2xl text-center text-black font-bold mt-8">
                    Frequently Asked Questions
                </h3>

                <div className="px-5 mb-5 md:px-64 md:mb-8">
                    <div className="collapse collapse-arrow border border-base-300 mt-10 mb-5">
                        <input type="checkbox" name="my-accordion-2" />
                        <div className="collapse-title font-semibold text-black">
                            How do I create an account?
                        </div>
                        <div className="collapse-content text-sm text-black">
                            Click the "Sign Up" button in the top right corner
                            and follow the registration process.
                        </div>
                    </div>

                    <div className="collapse collapse-arrow join-item border-base-300 border mb-5">
                        <input type="checkbox" name="my-accordion-2" />
                        <div className="collapse-title font-semibold text-black">
                            I forgot my password. What should I do?
                        </div>
                        <div className="collapse-content text-sm text-black">
                            Click on "Forgot Password" on the login page and
                            follow the instructions sent to your email.
                        </div>
                    </div>

                    <h4 className="text-black text-center text-xl font-bold">
                        Still have questions?
                    </h4>
                    <div className="flex flex-row justify-center">
                        <div className="btn btn-primary mt-3 w-60 text-lg">
                            Contact Us
                        </div>
                    </div>
                </div>
            </div>

            {/* Join community */}
            <h2 className="text-black text-center font-bold text-xl mt-10 md:mt-14">
                Join Our Community
            </h2>
            <p className="text-black text-center px-5 md:px-0">
                Be part of the sustainable shopping movement. Create an account
                today to start buying and selling preloved items.
            </p>
            <div className="flex flex-row justify-center mt-5 mb-5">
                <a href="#" className="btn btn-success text-lg text-white w-60">
                    Sign Up
                </a>
            </div>
            <Footer />
        </div>
    );
}
