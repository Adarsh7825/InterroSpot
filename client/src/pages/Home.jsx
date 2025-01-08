import React, { useEffect, useState } from 'react'
import { FaArrowRight } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import HighlightText from '../components/core/HomePage/HighlightText'

import CTAButton from "../components/core/HomePage/Button"
import CodeBlocks from "../components/core/HomePage/CodeBlocks"
import TimelineSection from '../components/core/HomePage/TimelineSection'
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection'
import InterviewerSection from '../components/core/HomePage/InterviewerSection'
import ExploreMore from '../components/core/HomePage/ExploreMore'

import { motion } from 'framer-motion'
import { fadeIn, } from './../components/common/motionFrameVarients';

// background random images
import backgroundImg1 from '../assets/Images/random bg img/coding bg1.jpg'
import backgroundImg2 from '../assets/Images/random bg img/coding bg2.jpg'
import backgroundImg3 from '../assets/Images/random bg img/coding bg3.jpg'
import backgroundImg4 from '../assets/Images/random bg img/coding bg4.jpg'
import backgroundImg5 from '../assets/Images/random bg img/coding bg5.jpg'
import backgroundImg6 from '../assets/Images/random bg img/coding bg6.jpeg'
import backgroundImg7 from '../assets/Images/random bg img/coding bg7.jpg'
import backgroundImg8 from '../assets/Images/random bg img/coding bg8.jpeg'
import backgroundImg9 from '../assets/Images/random bg img/coding bg9.jpg'
import backgroundImg10 from '../assets/Images/random bg img/coding bg10.jpg'
import backgroundImg111 from '../assets/Images/random bg img/coding bg11.jpg'


const randomImges = [
    backgroundImg1,
    backgroundImg2,
    backgroundImg3,
    backgroundImg4,
    backgroundImg5,
    backgroundImg6,
    backgroundImg7,
    backgroundImg8,
    backgroundImg9,
    backgroundImg10,
    backgroundImg111,
];

// hardcoded



const Home = () => {
    const navigate = useNavigate();

    // get background random images
    const [backgroundImg, setBackgroundImg] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [roomCode, setRoomCode] = useState('');

    useEffect(() => {
        const bg = randomImges[Math.floor(Math.random() * randomImges.length)]
        setBackgroundImg(bg);
    }, [])

    const handleJoinRoom = (e) => {
        e.preventDefault();
        if (roomCode.trim()) {
            navigate(`/room/${roomCode}`);
        }
    }

    return (
        <React.Fragment>
            {/* background random image */}
            <div>
                <div className="w-full h-[450px] md:h-[650px] absolute top-0 left-0 opacity-[0.3] overflow-hidden object-cover ">
                    <img src={backgroundImg} alt="Background"
                        className="w-full h-full object-cover "
                    />

                    <div className="absolute left-0 bottom-0 w-full h-[250px] opacity_layer_bg "></div>
                </div>
            </div>

            <div className=' '>
                {/*Section1  */}
                <div className='relative h-[450px] md:h-[550px] justify-center mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white'>

                    {/* Become Interviewer Button */}
                    <Link to={"/signup"}>
                        <div className='z-0 group p-1 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 font-bold text-white
                                    transition-all duration-200 hover:scale-95 w-fit'>
                            <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
                                transition-all duration-200 group-hover:bg-richblack-900 backdrop-blur-sm'>
                                <p>Become an Interviewer</p>
                                <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </div>
                        </div>
                    </Link>

                    {/* Main Heading */}
                    <motion.div
                        variants={fadeIn('left', 0.1)}
                        initial='hidden'
                        whileInView={'show'}
                        viewport={{ once: false, amount: 0.1 }}
                        className='text-center text-3xl lg:text-4xl font-semibold mt-7  '
                    >
                        Save your engineering
                        <HighlightText text={" Bandwidth"} />
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div className="relative">
                        <input
                            type="text"
                            placeholder="Search Profile"
                            className="w-96 h-12 mt-6 rounded-full border-2 border-richblack-700 bg-richblack-800 text-white text-center 
                                     placeholder-richblack-400 focus:border-blue-500 focus:outline-none transition-all duration-200
                                     hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-richblack-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </motion.div>

                    {/* Subheading */}
                    <motion.div
                        variants={fadeIn('right', 0.1)}
                        initial='hidden'
                        whileInView={'show'}
                        viewport={{ once: false, amount: 0.1 }}
                        className='mt-4 w-[90%] text-center text-lg lg:text-xl font-medium text-richblack-300'
                    >
                        Outsource your interviews in just 2 simple steps
                    </motion.div>

                    {/* Action Buttons */}
                    <div className='flex flex-wrap justify-center gap-4 mt-8'>
                        <CTAButton active={true} linkto={"/about"}>
                            <span className="flex items-center gap-2">
                                Learn More
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </CTAButton>

                        <CTAButton active={false} linkto={"/dashboard/form"}>
                            <span className="flex items-center gap-2">
                                Create Interview
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </span>
                        </CTAButton>

                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 rounded-md py-3 px-6 font-semibold text-richblack-100 
                                     border border-richblack-700 bg-richblack-800 hover:bg-richblack-700 
                                     transition-all duration-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                        >
                            Join Room
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>

                        <CTAButton active={false} linkto={"/create-room"}>
                            <span className="flex items-center gap-2">
                                Pair Programming
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </span>
                        </CTAButton>

                        <CTAButton active={false} linkto={"/roomdata/NX5oHS"}>
                            <span className="relative inline-flex items-center gap-2 px-6 py-2 
                                     bg-gradient-to-r from-blue-500 to-purple-500 
                                     text-white font-bold rounded-lg
                                     animate-pulse hover:animate-none
                                     hover:shadow-[0_0_15px_rgba(56,189,248,0.5)]
                                     transition-all duration-300">
                                Sample Room
                                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full 
                                        animate-ping"></div>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 animate-bounce"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </span>
                        </CTAButton>
                    </div>
                </div>

                {/* animated code */}
                <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between'>
                    {/* Code block 1 */}
                    <div className=''>
                        <CodeBlocks
                            position={"lg:flex-row"}
                            heading={
                                <div className='text-3xl lg:text-4xl font-semibold'>
                                    Unlock Your
                                    <HighlightText text={"Interview potential "} />
                                    with our Platform
                                </div>
                            }
                            subheading={
                                "Our Interviewer are FROM industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                            }
                            ctabtn1={
                                {
                                    btnText: "Try it yourself",
                                    linkto: "/signup",
                                    active: true,
                                }
                            }
                            ctabtn2={
                                {
                                    btnText: "Learn More",
                                    linkto: "/login",
                                    active: false,
                                }
                            }

                            codeblock={`<<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n</head>\n<body>\n<h1><ahref="/">Header</a>\n</h1>\n<nav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n</nav>`}
                            codeColor={"text-yellow-25"}
                            backgroundGradient={"code-block1-grad"}
                        />
                    </div>


                    {/* Code block 2 */}
                    <div>
                        <CodeBlocks
                            position={"lg:flex-row-reverse"}
                            heading={
                                <div className="text-3xl lg:text-4xl font-semibold">
                                    Start
                                    <HighlightText text={"Interview in seconds"} />
                                </div>
                            }
                            subheading={
                                "Go ahead, give it a try. Our hands-on Interview environment means you'll be writing real code with best experience."
                            }
                            ctabtn1={{
                                btnText: "Start Now",
                                link: "/signup",
                                active: true,
                            }}
                            ctabtn2={{
                                btnText: "Learn More",
                                link: "/signup",
                                active: false,
                            }}
                            codeColor={"text-white"}
                            codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)}\nexport default Home;`}
                            backgroundGradient={"code-block2-grad"}
                        />
                    </div>
                    <ExploreMore />
                </div>

                {/*Section 2  */}
                <div className='bg-pure-greys-5 text-richblack-700 '>
                    <div className='homepage_bg h-[310px]'>
                        <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto'>
                            <div className='h-[150px]'></div>
                            <div className='flex flex-row gap-7 text-white '>
                                <CTAButton active={true} linkto={"/signup"}>
                                    <div className='flex items-center gap-3' >
                                        Explore Full Catalog
                                        <FaArrowRight />
                                    </div>
                                </CTAButton>
                                <CTAButton active={false} linkto={"/signup"}>
                                    <div>
                                        Learn more
                                    </div>
                                </CTAButton>
                            </div>
                        </div>
                    </div>

                    <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>
                        <div className='flex flex-col lg:flex-row gap-5 mb-10 mt-[95px]'>
                            <div className='text-3xl lg:text-4xl font-semibold w-full lg:w-[45%]'>
                                Get the Skills you need for a
                                <HighlightText text={"Job that is in demand"} />
                            </div>

                            <div className='flex flex-col gap-10 w-full lg:w-[40%] items-start'>
                                <div className='text-[16px]'>
                                    The modern Interactive is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                                </div>
                                <CTAButton active={true} linkto={"/signup"}>
                                    <div>
                                        Learn more
                                    </div>
                                </CTAButton>
                            </div>
                        </div>


                        {/* leadership */}
                        <TimelineSection />

                        <LearningLanguageSection />

                    </div>

                </div>


                {/*Section 3 */}
                <div className='mt-14 w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white'>
                    <InterviewerSection />
                </div>
            </div >

            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-richblack-800 p-8 rounded-lg w-96">
                        <h2 className="text-2xl font-bold mb-4 text-white">Enter Room Code</h2>
                        <form onSubmit={handleJoinRoom}>
                            <input
                                type="text"
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value)}
                                className="w-full p-2 mb-4 rounded bg-richblack-700 text-white"
                                placeholder="Enter room code"
                            />
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 py-2 px-4 bg-yellow-50 text-black rounded font-semibold"
                                >
                                    Join
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2 px-4 bg-richblack-700 text-white rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </React.Fragment>
    )
}

export default Home