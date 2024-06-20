import signupImg from "../assets/Images/signup.png"
import Template from "../components/core/Auth/Template"

function Signup() {
    return (
        <Template
            title="Join the millions test you skills with InterroSpot"
            description1="Build skills for today, tomorrow, and beyond."
            image={signupImg}
            formType="signup"
        />
    )
}

export default Signup