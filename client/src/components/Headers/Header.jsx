import React, { useState } from 'react';
import DarkModeSwitcher from './DarkModeSwitcher';

const Header = () => {
    // State to manage mobile menu visibility
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            {/* Padding adjusted for content overlap */}
            <div className='pt-16 md:pt-20'>

                {/* Mobile Menu Button */}
                <div className="mt-6 md:hidden flex justify-between items-center px-4 py-2 bg-black text-white fixed top-0 left-0 w-full z-50">
                    <img src="../../public/interactiview-logo.png" alt="Logo" className="w-28 h-auto" />
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {/* Hamburger Icon */}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                    </button>
                </div>

                {/* Top Navbar */}
                <div className={`fixed top-0 left-0 w-full bg-black text-white z-50 ${isMenuOpen ? 'block' : 'hidden'} md:flex justify-between items-center`}>
                    <div className="max-w-6xl mx-auto px-4 py-2">
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                            <a href="#" className="hover:text-gray-300">Outsource Interviews</a>
                            <a href="#" className="hover:text-gray-300">Assessment platform</a>
                            <a href="#" className="hover:text-gray-300">Mock interview</a>
                            <a href="#" className="hover:text-gray-300">Contact us</a>
                            <a href="#" className="hover:text-gray-300">Login</a>
                        </div>

                        {<div className="flex items-center gap-3 2xsm:gap-7">
                            <ul className="flex items-center gap-2 2xsm:gap-4">
                                {/* <!-- Dark Mode Toggler --> */}
                                {/* <DarkModeSwitcher /> */}
                            </ul>

                        </div>}


                    </div>
                </div>

                {/* Bottom Navbar - Adjusted to remove gap and hide on mobile */}
                <div className="hidden md:flex fixed md:top-10 left-0 w-full bg-white text-black shadow-md z-40">
                    <div className="max-w-6xl mx-auto px-4 py-2 flex justify-between items-center">
                        <div className="flex space-x-4">
                            <img src="../../public/interactiview-logo.png" alt="WhatsApp" className="w-28 h-auto" />
                            <a href="#" className="hover:text-gray-600 flex">Solutions</a>

                            <a href="#" className="hover:text-gray-600">Products</a>
                            <a href="#" className="hover:text-gray-600">Integrations</a>
                            <a href="#" className="hover:text-gray-600">Pricing</a>
                            <a href="#" className="hover:text-gray-600">Become an interview engineer</a>
                        </div>
                        <div>
                            <a href="#" className="hover:text-gray-600">Request Demo</a>
                            <a href="#" className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Signup</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;