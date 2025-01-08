import React from 'react'
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import timelineImage from "../../../assets/Images/TimelineImage.png"

const TimelineSection = () => {
    const timelineData = [
        {
            Logo: Logo1,
            heading: "Practice Coding",
            Description: "Solve real interview problems with our extensive question bank",
        },
        {
            Logo: Logo2,
            heading: "Mock Interviews",
            Description: "Schedule live interviews with experienced recruiters",
        },
        {
            Logo: Logo3,
            heading: "Pair Programming",
            Description: "Collaborate with peers on real-time coding challenges",
        },
        {
            Logo: Logo4,
            heading: "Get Expert Feedback",
            Description: "Receive detailed feedback to improve your performance",
        }
    ];

    return (
        <div className='flex flex-col lg:flex-row gap-20 mb-20 items-center'>
            <div className='lg:w-[45%] flex flex-col gap-14 lg:gap-3'>
                <div className='flex flex-col gap-3'>
                    <div className='flex gap-6'>
                        <div className='w-[52px] h-[52px] bg-white rounded-full flex justify-center items-center shadow-[#00000012] shadow-[0_0_62px_0]'>
                            <img src={Logo1} alt="" />
                        </div>
                        <div>
                            <h2 className='font-semibold text-[18px]'>Create Profile</h2>
                            <p className='text-base text-richblack-300'>Sign up and complete your profile to get started</p>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-3'>
                    <div className='flex gap-6'>
                        <div className='w-[52px] h-[52px] bg-white rounded-full flex justify-center items-center shadow-[#00000012] shadow-[0_0_62px_0]'>
                            <img src={Logo2} alt="" />
                        </div>
                        <div>
                            <h2 className='font-semibold text-[18px]'>Practice Problems</h2>
                            <p className='text-base text-richblack-300'>Solve coding problems and prepare for interviews</p>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-3'>
                    <div className='flex gap-6'>
                        <div className='w-[52px] h-[52px] bg-white rounded-full flex justify-center items-center shadow-[#00000012] shadow-[0_0_62px_0]'>
                            <img src={Logo3} alt="" />
                        </div>
                        <div>
                            <h2 className='font-semibold text-[18px]'>Join Mock Interviews</h2>
                            <p className='text-base text-richblack-300'>Schedule and participate in live mock interviews</p>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-3'>
                    <div className='flex gap-6'>
                        <div className='w-[52px] h-[52px] bg-white rounded-full flex justify-center items-center shadow-[#00000012] shadow-[0_0_62px_0]'>
                            <img src={Logo4} alt="" />
                        </div>
                        <div>
                            <h2 className='font-semibold text-[18px]'>Get Feedback</h2>
                            <p className='text-base text-richblack-300'>Receive detailed feedback and improve your skills</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='relative w-fit h-fit shadow-blue-200 shadow-[0px_0px_30px_0px]'>
                <div className='absolute lg:left-[50%] lg:bottom-0 lg:translate-x-[-50%] lg:translate-y-[50%] bg-caribbeangreen-700 flex lg:flex-row flex-col text-white uppercase py-5 gap-4 lg:gap-0 lg:py-10 '>
                    <div className='flex gap-5 items-center lg:border-r border-caribbeangreen-300 px-7 lg:px-14'>
                        <h1 className='text-3xl font-bold w-[75px]'>10</h1>
                        <p className='text-caribbeangreen-300 text-sm w-[75px]'>Practice Problems</p>
                    </div>

                    <div className='flex gap-5 items-center lg:border-r border-caribbeangreen-300 px-7 lg:px-14'>
                        <h1 className='text-3xl font-bold w-[75px]'>5+</h1>
                        <p className='text-caribbeangreen-300 text-sm w-[75px]'>Mock Interviews</p>
                    </div>

                    <div className='flex gap-5 items-center px-7 lg:px-14'>
                        <h1 className='text-3xl font-bold w-[75px]'>100+</h1>
                        <p className='text-caribbeangreen-300 text-sm w-[75px]'>Success Stories</p>
                    </div>
                </div>

                <img src={timelineImage} alt="Timeline" className='shadow-white shadow-[20px_20px_0px_0px] object-cover h-[400px] lg:h-fit' />
            </div>
        </div>
    )
}

export default TimelineSection