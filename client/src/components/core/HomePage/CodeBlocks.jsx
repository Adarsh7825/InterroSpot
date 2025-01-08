import React from 'react'
import { motion } from 'framer-motion'
import { fadeIn } from '../../common/motionFrameVarients'
import { TypeAnimation } from 'react-type-animation'

const CodeBlocks = () => {
    return (
        <div className='flex flex-col gap-20'>

            {/* Section 1: For Candidates */}
            <div className='flex flex-col lg:flex-row gap-10 justify-between'>
                {/* Left Content */}
                <motion.div
                    variants={fadeIn('right', 0.2)}
                    initial="hidden"
                    whileInView={'show'}
                    className='w-full lg:w-[50%] flex flex-col gap-8'
                >
                    <h2 className='text-4xl font-semibold'>
                        For <span className='text-blue-400'>Candidates</span>
                    </h2>
                    <p className='text-richblack-300 font-bold'>
                        Practice coding interviews with our comprehensive platform:
                    </p>
                    <div className='flex gap-3 mt-7'>
                        <button className='yellowButton'>Practice Now</button>
                        <button className='blackButton'>View Problems</button>
                    </div>
                </motion.div>

                {/* Right Code Block */}
                <motion.div
                    variants={fadeIn('left', 0.2)}
                    initial="hidden"
                    whileInView={'show'}
                    className='h-fit code-border flex flex-row py-3 text-[10px] sm:text-sm leading-[18px] sm:leading-6 relative w-[100%] lg:w-[470px]'
                >
                    <div className='code-block1-grad'></div>
                    <div className='text-center flex flex-col   w-[10%] select-none text-richblack-400 font-inter font-bold '>
                        <p>1</p>
                        <p>2</p>
                        <p>3</p>
                        <p>4</p>
                        <p>5</p>
                    </div>
                    <div className='w-[90%] flex flex-col gap-2 font-bold font-mono pr-2'>
                        <TypeAnimation
                            sequence={[
                                `function solve(array) {\n   return array.sort((a,b) => a-b);\n}\n\n// Start practicing now`,
                                1000,
                                "",
                            ]}
                            repeat={Infinity}
                            cursor={true}
                            style={{
                                whiteSpace: "pre-line",
                                display: "block",
                            }}
                            omitDeletionAnimation={true}
                        />
                    </div>
                </motion.div>
            </div>

            {/* Section 2: For Recruiters */}
            <div className='flex flex-col lg:flex-row-reverse gap-10 justify-between'>
                {/* Left Content */}
                <motion.div
                    variants={fadeIn('left', 0.2)}
                    initial="hidden"
                    whileInView={'show'}
                    className='w-full lg:w-[50%] flex flex-col gap-8'
                >
                    <h2 className='text-4xl font-semibold'>
                        For <span className='text-yellow-400'>Recruiters</span>
                    </h2>
                    <p className='text-richblack-300 font-bold'>
                        Conduct seamless technical interviews and evaluate candidates effectively:
                    </p>
                    <div className='flex gap-3 mt-7'>
                        <button className='yellowButton'>Create Interview</button>
                        <button className='blackButton'>View Dashboard</button>
                    </div>
                </motion.div>

                {/* Right Code Block */}
                <motion.div
                    variants={fadeIn('right', 0.2)}
                    initial="hidden"
                    whileInView={'show'}
                    className='h-fit code-border flex flex-row py-3 text-[10px] sm:text-sm leading-[18px] sm:leading-6 relative w-[100%] lg:w-[470px]'
                >
                    <div className='code-block2-grad'></div>
                    <div className='text-center flex flex-col w-[10%] select-none text-richblack-400 font-inter font-bold '>
                        <p>1</p>
                        <p>2</p>
                        <p>3</p>
                        <p>4</p>
                        <p>5</p>
                    </div>
                    <div className='w-[90%] flex flex-col gap-2 font-bold font-mono pr-2'>
                        <TypeAnimation
                            sequence={[
                                `class Interview {\n   schedule(candidate) {\n      // Set up interview room\n   }\n}`,
                                1000,
                                "",
                            ]}
                            repeat={Infinity}
                            cursor={true}
                            style={{
                                whiteSpace: "pre-line",
                                display: "block",
                            }}
                            omitDeletionAnimation={true}
                        />
                    </div>
                </motion.div>
            </div>

        </div>
    )
}

export default CodeBlocks