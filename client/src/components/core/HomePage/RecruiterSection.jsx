const RecruiterSection = () => {
    return (
        <div className="recruiter-section">
            <h2 className="text-3xl font-bold">For Recruiters</h2>
            <p className="text-xl">
                Join our platform to conduct efficient technical interviews
            </p>

            <div className="features-grid">
                <div className="feature">
                    <h3>Custom Interview Rooms</h3>
                    <p>Create specialized rooms for different roles</p>
                </div>
                <div className="feature">
                    <h3>Question Bank</h3>
                    <p>Access curated technical questions</p>
                </div>
                <div className="feature">
                    <h3>Evaluation Tools</h3>
                    <p>Assess candidates effectively</p>
                </div>
                <div className="feature">
                    <h3>Detailed Analytics</h3>
                    <p>Track interview performance metrics</p>
                </div>
            </div>

            <button className="cta-button">
                Become an Interviewer
            </button>
        </div>
    )
} 