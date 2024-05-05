import React from "react";

import FoundingStory from "../assets/Images/FoundingStory.png";
import BannerImage1 from "../assets/Images/aboutus1.webp";
import BannerImage2 from "../assets/Images/aboutus2.webp";
import BannerImage3 from "../assets/Images/aboutus3.webp";

import ContactFormSection from "../components/core/AboutPage/ContactFormSection";
import LearningGrid from "../components/core/AboutPage/LearningGrid";
import Quote from "../components/core/AboutPage/Quote";
import StatsComponent from "../components/core/AboutPage/Stats";
import HighlightText from "../components/core/HomePage/HighlightText";
import Img from "../components/common/Img";
import ReviewSlider from './../components/common/ReviewSlider';
import { MdOutlineRateReview } from 'react-icons/md';
import { motion } from 'framer-motion';
import { fadeIn } from "../components/common/motionFrameVarients";

const About = () => {
    return (
        <div>
            <section className="bg-richblack-700">
                <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-center text-white">
                    <motion.header
                        className="mx-auto py-20 text-4xl font-semibold lg:w-[70%]"
                    >
                        <motion.p
                            variants={fadeIn('down', 0.1)}
                            initial='hidden'
                            whileInView={'show'}
                            viewport={{ once: false, amount: 0.1 }}
                        > Connecting Tech Talents with Global Opportunities at
                            <HighlightText text={"Interrospot"} />
                        </motion.p>

                        <motion.p
                            variants={fadeIn('up', 0.1)}
                            initial='hidden'
                            whileInView={'show'}
                            viewport={{ once: false, amount: 0.1 }}
                            className="mx-auto mt-3 text-center text-base font-medium text-richblack-300 lg:w-[95%]">
                            Interrospot is revolutionizing the way tech talents connect with leading companies, offering a seamless, real-time interview experience that transcends geographical boundaries.
                        </motion.p>
                    </motion.header>

                    <div className="sm:h-[70px] lg:h-[150px]"></div>

                    <div className=" absolute bottom-0 left-[50%] grid w-[100%] translate-x-[-50%] translate-y-[30%] grid-cols-3 gap-3 lg:gap-5">
                        <Img src={BannerImage1} alt="" />
                        <Img src={BannerImage2} alt="" />
                        <Img src={BannerImage3} alt="" />
                    </div>
                </div>
            </section>

            <section className="border-b border-richblack-700">
                <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
                    <div className="h-[100px] "></div>
                    <Quote />
                </div>
            </section>

            <section>
                <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
                    <div className="flex flex-col items-center gap-10 lg:flex-row justify-between">
                        <motion.div
                            variants={fadeIn('right', 0.1)}
                            initial='hidden'
                            whileInView={'show'}
                            viewport={{ once: false, amount: 0.1 }}
                            className="my-24 flex lg:w-[50%] flex-col gap-10">
                            <h1 className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                                Our Founding Story
                            </h1>
                            <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                                Interrospot was founded with the vision to bridge the gap between talented tech professionals and leading tech companies globally. Our platform leverages cutting-edge technology to simulate real-world interview scenarios, preparing candidates for the challenges of tech interviews.
                            </p>
                            <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Incidunt mollitia veritatis officia, aspernatur adipisci ipsam. Voluptas, suscipit dicta! Reprehenderit sequi cumque omnis impedit, nihil autem inventore corrupti eligendi. Dolores, facere!
                            </p>
                        </motion.div>

                        <motion.div
                            variants={fadeIn('left', 0.1)}
                            initial='hidden'
                            whileInView={'show'}
                            viewport={{ once: false, amount: 0.1 }}
                        >
                            <Img
                                src={FoundingStory}
                                alt="FoundingStory"
                                className="shadow-[0_0_20px_0] shadow-[#FC6767]"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            <StatsComponent />

            <section className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white">
                <div className="flex flex-col items-center lg:gap-10 lg:flex-row justify-between">
                    <div className="my-24 flex lg:w-[40%] flex-col gap-10">
                        <h1 className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                            Our Vision
                        </h1>
                        <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                            At Interrospot, our vision is to democratize access to tech careers globally, by providing a platform that not only connects tech talents with leading companies but also prepares them for the future of work. We aim to create a world where anyone, anywhere, can achieve their full potential in the tech industry, breaking down barriers to entry and fostering a diverse and inclusive tech ecosystem.
                        </p>
                    </div>

                    <div className="my-24 flex lg:w-[40%] flex-col gap-10">
                        <h1 className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-4xl font-semibold lg:w-[70%] ">
                            Our Mission
                        </h1>
                        <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                            Our mission is to empower tech talents with the skills, experience, and connections needed to thrive in the digital age. By leveraging cutting-edge technology and a comprehensive curriculum, we provide an immersive, real-time interview experience that prepares candidates for the challenges of tech interviews. We are committed to bridging the gap between learning and employment, ensuring our candidates are not just prepared, but are industry-ready and attractive to tech employers worldwide.
                        </p>
                    </div>
                </div>
                <LearningGrid />
                <ContactFormSection />
            </section>

            {/* Reviews from Other Learners */}
            <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
                <h1 className="text-center text-3xl lg:text-4xl font-semibold mt-8 flex justify-center items-center gap-x-3">
                    Reviews from other learners <MdOutlineRateReview className='text-yellow-25' />
                </h1>
                <ReviewSlider />
            </div>
        </div>
    )
}

export default About;