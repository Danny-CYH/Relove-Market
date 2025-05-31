import React from 'react'
import { GooglePlayButton, AppStoreButton } from 'react-mobile-app-button'
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn
} from 'react-icons/fa'

const Footer = () => {
    const iOSUrl =
        'https://itunes.apple.com/us/app/all-of-the-lights/id959389722?mt=8'
    const APKUrl = 'https://play.google.com/store/apps/details?id=host'

    return (
        <footer className='bg-black text-white px-6 md:px-20 py-12'>
            <div className='grid grid-cols-1 md:grid-cols-5 gap-10 text-sm md:text-md'>
                {/* Subscribe */}
                <div>
                    <h2 className='text-xl md:text-2xl font-semibold mb-4'>
                        Relove Market
                    </h2>
                    <p className='mb-4'>Get 10% off your first order</p>
                    <form className='flex items-center border border-white rounded overflow-hidden'>
                        <input
                            type='email'
                            placeholder='Enter your email'
                            className='bg-transparent px-3 py-2 outline-none text-white flex-1'
                        />
                        <button
                            type='submit'
                            className='bg-white text-black px-4 py-2'
                        >
                            →
                        </button>
                    </form>
                </div>

                {/* Support */}
                <div>
                    <h3 className='text-xl md:text-2xl font-semibold mb-4'>
                        Support
                    </h3>
                    <p>
                        Jalan Suka Menanti, Alor Setar,
                        <br />
                        Kedah, Malaysia.
                    </p>
                    <p className='mt-2'>chengyangho14@gmail.com</p>
                    <p className='mt-2'>+60189724865</p>
                </div>

                {/* Account */}
                <div>
                    <h3 className='text-xl md:text-2xl font-semibold mb-4'>
                        Account
                    </h3>
                    <ul className='space-y-2'>
                        <li>
                            <a href='#'>My Account</a>
                        </li>
                        <li>
                            <a href='#'>Login / Register</a>
                        </li>
                        <li>
                            <a href='#'>Cart</a>
                        </li>
                        <li>
                            <a href='#'>Wishlist</a>
                        </li>
                        <li>
                            <a href='#'>Shop</a>
                        </li>
                    </ul>
                </div>

                {/* Quick Link */}
                <div>
                    <h3 className='text-xl md:text-2xl font-semibold mb-4'>
                        Quick Link
                    </h3>
                    <ul className='space-y-2'>
                        <li>Privacy Policy</li>
                        <li>Terms Of Use</li>
                        <li>FAQ</li>
                        <li>Contact</li>
                    </ul>
                </div>

                {/* Download App */}
                <div>
                    <h3 className='text-xl md:text-2xl font-semibold mb-4'>
                        Download App Now !
                    </h3>
                    <div className='space-y-4 mb-4'>
                        <GooglePlayButton
                            url={APKUrl}
                            theme={'dark'}
                            className={'custom-style'}
                        />
                        <AppStoreButton
                            url={iOSUrl}
                            theme={'dark'}
                            className={'custom-style'}
                        />
                    </div>
                    <div className='flex space-x-4 text-lg'>
                        <FaFacebookF />
                        <FaTwitter />
                        <FaInstagram />
                        <FaLinkedinIn />
                    </div>
                </div>
            </div>

            <div className='border-t border-gray-700 mt-10 pt-4 text-center text-sm md:text-md'>
                © Copyright Danny CYH 2025. All right reserved
            </div>
        </footer>
    )
}

export default Footer
