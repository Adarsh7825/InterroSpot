import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from "react-icons/fa"
import { TypeAnimation } from 'react-type-animation'
import { motion } from 'framer-motion'
import { fadeIn } from '../../common/motionFrameVarients'

const Hero = () => {
    // Function to open in regular window
    const openRegularDemo = () => {
        const demoUrl = window.location.origin + '/login';
        // Store demo credentials
        localStorage.setItem('demoEmail', 'adarshgupta2626@gmail.com');
        localStorage.setItem('demoPassword', 'adarshgupta2626@gmail.com');
        window.open(demoUrl, '_blank');
    };

    // Function to open in incognito
    const openIncognitoDemo = () => {
        const demoUrl = window.location.origin + '/login';
        alert(`Please open this link in incognito mode and use these credentials:
        Email: beyog88735@noefa.com
        Password: beyog88735@noefa.com`);
        window.open(demoUrl);
    };

    return (
        <div className='relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white'>

            {/* Heading */}
            <div className='text-center text-4xl font-semibold mt-8 lg:w-[70%]'>
                Master Technical Interviews
                <div className='mt-4 font-bold'>
                    <TypeAnimation
                        sequence={[
                            'With Real-Time Practice',
                            1500,
                            'With Expert Feedback',
                            1500,
                            'With Mock Interviews',
                            1500,
                            'With Pair Programming',
                            1500
                        ]}
                        wrapper="span"
                        speed={50}
                        className='text-transparent bg-clip-text bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB]'
                        repeat={Infinity}
                    />
                </div>
            </div>

            {/* Sub Heading */}
            <motion.div
                variants={fadeIn('up', 0.3)}
                initial="hidden"
                whileInView={'show'}
                viewport={{ once: false, amount: 0.7 }}
                className='mt-4 text-center text-lg font-bold text-richblack-300 lg:w-[65%]'
            >
                Prepare for technical interviews with real coding challenges, live mock interviews, and expert feedback from industry professionals.
            </motion.div>

            {/* Modified CTA Buttons Section */}
            <div className='flex flex-col items-center gap-4'>
                {/* Main action buttons */}
                <div className='flex flex-row gap-4 flex-wrap justify-center'>
                    <Link to="/signup">
                        <button className='yellowButton'>
                            Get Started
                            <FaArrowRight className='inline ml-2' />
                        </button>
                    </Link>
                    <Link to="/about">
                        <button className='blackButton'>
                            Learn More
                        </button>
                    </Link>
                    <Link to="/create-room">
                        <button className='yellowButton'>
                            Pair Programming
                        </button>
                    </Link>
                </div>

                {/* Demo buttons with divider */}
                <div className='mt-4 flex flex-col items-center'>
                    <p className='text-richblack-300 mb-2'>Try our platform with demo accounts:</p>
                    <div className='flex gap-4 flex-wrap justify-center'>
                        <button
                            onClick={openRegularDemo}
                            className='px-4 py-2 bg-richblack-800 text-richblack-100 rounded-md hover:bg-richblack-700 flex items-center gap-2'
                        >
                            Try as Candidate
                            <span className='text-xs text-richblack-300'>(Regular Window)</span>
                        </button>
                        <button
                            onClick={openIncognitoDemo}
                            className='px-4 py-2 bg-richblack-800 text-richblack-100 rounded-md hover:bg-richblack-700 flex items-center gap-2'
                        >
                            Try as Recruiter
                            <span className='text-xs text-richblack-300'>(Incognito Mode)</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full'>
                <div className='glass-bg p-6 rounded-lg'>
                    <h3 className='text-xl font-bold mb-3'>Live Interviews</h3>
                    <p className='text-richblack-300'>Practice with real recruiters in mock interview sessions</p>
                </div>
                <div className='glass-bg p-6 rounded-lg'>
                    <h3 className='text-xl font-bold mb-3'>Pair Programming</h3>
                    <p className='text-richblack-300'>Collaborate in real-time coding sessions with peers</p>
                </div>
                <div className='glass-bg p-6 rounded-lg'>
                    <h3 className='text-xl font-bold mb-3'>Smart Practice</h3>
                    <p className='text-richblack-300'>AI-powered question recommendations based on your performance</p>
                </div>
            </div>

        </div>
    )
}

export default Hero 