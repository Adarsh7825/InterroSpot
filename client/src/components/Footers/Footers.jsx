import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-black text-white px-8 py-4">
            <div className="container mx-auto">
                <div className="flex flex-wrap justify-between items-center">
                    <div>
                        <img src="../../public/interactiview-logo.png" alt="Logo" className="h-8 w-auto" />
                    </div>
                    <div>
                        <a href="#" className="text-white hover:underline">Facebook</a>
                        <a href="#" className="text-white hover:underline">Instagram</a>
                        <a href="#" className="text-white hover:underline">Twitter</a>
                        <a href="#" className="text-white hover:underline">LinkedIn</a>
                    </div>
                </div>
                <div className="mt-8">
                    <h2 className="text-lg font-semibold">Signup Now!</h2>
                    <p>We are already working with teams that want to hire the best engineers</p>
                    <div className="mt-4">
                        <button className="bg-white text-black px-4 py-2 rounded">Signup now for free trial</button>
                        <button className="bg-white text-black px-4 py-2 rounded ml-4">Book a meeting with sales</button>
                    </div>
                </div>
                {/* Add more sections as per your requirement */}
            </div>
            <div className="mt-8 text-center">
                <p>Made with ❤ in India, Intervue © 2024</p>
            </div>
        </footer>
    );
};

export default Footer;
