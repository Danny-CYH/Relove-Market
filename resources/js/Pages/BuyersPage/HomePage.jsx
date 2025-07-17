import { FaSearch, FaCamera } from 'react-icons/fa'
import Navbar from '@/Components/Navbar'
import Footer from '@/Components/Footer'
import Carousel_ProductData from '@/Components/Carousel_ProductData'

export default function HomePage () {
    return (
        <div className='h-96 flex flex-col bg-white'>
            <Navbar />
            <main className='flex-grow'>
                <div
                    className='relative h-72 md:h-banner bg-cover bg-center w-full'
                    style={{ backgroundImage: `url('../image/home_page.jpg')` }}
                >
                    {/* Overlay */}
                    <div className='absolute inset-0 bg-black bg-opacity-40'></div>

                    {/* Content */}
                    <div className='relative z-10 flex flex-col items-center justify-center min-h-60 md:h-banner text-white px-4 text-center'>
                        <h2 className='text-xl sm:text-2xl md:text-3xl font-light mb-2'>
                            Give Items a Second Life,
                        </h2>
                        <h1 className='text-2xl sm:text-4xl md:text-5xl font-bold mb-6'>
                            Shop Relove!
                        </h1>

                        {/* Responsive Search Bar */}
                        <div className='flex items-center bg-white rounded-full shadow-md w-full max-w-sm sm:max-w-md md:max-w-lg px-4 py-2 mx-auto'>
                            <input
                                type='text'
                                placeholder='Search for any item'
                                className='flex-grow outline-none text-gray-700 placeholder-gray-500 border-none focus:ring-0 text-sm sm:text-base'
                            />
                            <button className='text-white bg-blue-500 hover:bg-blue-600 rounded-full p-2 ml-2'>
                                <FaSearch />
                            </button>
                            <button className='text-white bg-gray-500 hover:bg-gray-600 rounded-full p-2 ml-2'>
                                <FaCamera />
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Carousel_ProductData />

            <Footer />
        </div>
    )
}
