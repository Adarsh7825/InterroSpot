import React from 'react';

const AccessAccount = () => {
    return (
        <>
            <br />
            <br />
            <br />
            <section className="container mx-auto">
                <div className="flex flex-wrap justify-center">
                    {/* Companies Card */}
                    <div className="w-full sm:w-2/3 lg:w-1/3 lg:order-1 mb-4">
                        <div className="bg-white p-6 shadow-lg">
                            <div className="flex items-center mb-4">
                                {/* SVG and Text */}
                                <div className="flex items-center mr-2">
                                    {/* SVG Placeholder */}
                                    <div className="w-6 h-6 bg-black text-white rounded-full flex justify-center items-center mr-2">SVG</div>
                                    <strong>Save 90% of hiring bandwidth</strong>
                                </div>
                            </div>
                            <div className="mb-2">
                                <strong>For Companies</strong>
                            </div>
                            <div className="mb-4">
                                Conduct interviews asynchronously on Intervue's platform by vetted interviewers. A detailed report of the candidate's performance is available within 5 minutes.
                            </div>
                            <a className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-2" href="/login">Login</a>
                            <div className="text-sm">
                                <span>Don't have an account? </span>
                                <a className="text-blue-500 hover:underline" href="/signup">Register</a>
                            </div>
                            <div className="text-sm mt-4">
                                <span>Need help?</span><br />
                                <a className="text-blue-500 hover:underline" href="#"><strong>Contact Sales</strong></a>
                            </div>
                        </div>
                    </div>
                    <br />
                    <br />
                    {/* Interviewer Card */}
                    <div className="w-full sm:w-2/3 lg:w-1/3 lg:order-0 mb-4">
                        <div className="bg-white p-6 shadow-lg">
                            <div className="flex items-center mb-4">
                                {/* SVG Placeholder */}
                                <div className="w-6 h-6 bg-black text-white rounded-full flex justify-center items-center mr-2">SVG</div>
                                <strong>Earn & Grow 10x</strong>
                            </div>
                            <div className="mb-2">
                                <strong>Become an Interviewer</strong>
                            </div>
                            <div className="mb-4">
                                Join our community of freelance interviewers at Intervue. Gain exposure beyond your workspace and exercise the power of your knowledge and freedom.
                            </div>
                            <a className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" href="/become-an-interview-engineer">Login</a>
                        </div>
                    </div>

                    {/* Candidates Card */}
                    <div className="w-full sm:w-2/3 lg:w-1/3 lg:order-1 mb-4">
                        <div className="bg-white p-6 shadow-lg">
                            <div className="flex items-center mb-4">
                                {/* SVG Placeholder */}
                                <div className="w-6 h-6 bg-black text-white rounded-full flex justify-center items-center mr-2">SVG</div>
                                <strong>Mock interviews</strong>
                            </div>
                            <div className="mb-2">
                                <strong>For Candidates</strong>
                            </div>
                            <div className="mb-4">
                                Get actionable feedback of your interview from industry experts and share it with <strong>400+</strong> actively hiring brands.
                            </div>
                            <a className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-2" href="/login/candidate">Login</a>
                            <div className="text-sm">
                                <span>Don't have an account? </span>
                                <a className="text-blue-500 hover:underline" href="/signup/candidate">Register</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AccessAccount;