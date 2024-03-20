// HalfHalfImageText.js
import React from 'react';

const BecomeAnInterviewer = () => {
    return (
        <div className="py-20">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl text-white">Earn money by taking interviews</h1>
                </div>
                <div className="flex flex-wrap -mx-4">
                    <div className="w-full lg:w-1/2 px-4">
                        <div className=" text-white content h-full flex items-center py-14">
                            <p className="text-xl">
                                Earn money by taking interviews
                                <br />
                                Become an Interview Engineer
                                <br />
                                <button className='text-center ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600' >
                                    Connect with LinkedIn</button>
                            </p>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 px-4">
                        <div className="img h-full bg-center bg-cover rounded-lg" style={{ backgroundImage: "url('https://images.pexels.com/photos/89784/bmw-suv-all-terrain-vehicle-fog-89784.jpeg?cs=srgb&dl=automobile-bmw-car-89784.jpg&fm=jpg')" }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BecomeAnInterviewer;