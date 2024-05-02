import signupImg from "../assets/Images/signup.png"
import Template from "../components/core/Auth/Template"

function Signup() {
    return (
        <Template
            title="Join the millions test you skills with InterroSpot"
            description1="Build skills for today, tomorrow, and beyond."
            description2="Education is a journey, not a destination"
            image={signupImg}
            formType="signup"
        />
    )
}

export default Signup