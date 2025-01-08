import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { FaUserTie, FaCode } from "react-icons/fa"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../../../services/operations/authAPI"

function LoginForm() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const [showPassword, setShowPassword] = useState(false)
    const { email, password } = formData

    const handleOnChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }))
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
        dispatch(login(email, password, navigate))
    }

    // Demo login handlers
    const handleCandidateDemo = () => {
        setFormData({
            email: "adarshgupta2626@gmail.com",
            password: "adarshgupta2626@gmail.com"
        })
    }

    const handleRecruiterDemo = () => {
        setFormData({
            email: "beyog88735@noefa.com",
            password: "beyog88735@noefa.com"
        })
    }

    return (
        <form
            onSubmit={handleOnSubmit}
            className="mt-6 flex w-full flex-col gap-y-4"
        >
            {/* Demo Account Selection */}
            <div className="flex flex-col gap-y-4 mb-6">
                <h3 className="text-richblack-5 text-lg font-semibold">Quick Access Demo Accounts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={handleCandidateDemo}
                        className="flex items-center justify-center gap-2 rounded-lg bg-richblack-800 py-3 px-4 text-richblack-5 hover:bg-richblack-700 border border-richblack-700 transition-all duration-200"
                    >
                        <FaCode className="text-xl" />
                        <div className="flex flex-col items-start">
                            <span className="font-semibold">Candidate Demo</span>
                            <span className="text-xs text-richblack-300">Practice Interviews</span>
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={handleRecruiterDemo}
                        className="flex items-center justify-center gap-2 rounded-lg bg-richblack-800 py-3 px-4 text-richblack-5 hover:bg-richblack-700 border border-richblack-700 transition-all duration-200"
                    >
                        <FaUserTie className="text-xl" />
                        <div className="flex flex-col items-start">
                            <span className="font-semibold">Recruiter Demo</span>
                            <span className="text-xs text-richblack-300">Conduct Interviews</span>
                        </div>
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <div className="h-[1px] w-full bg-richblack-700"></div>
                <p className="text-richblack-300 font-medium">OR</p>
                <div className="h-[1px] w-full bg-richblack-700"></div>
            </div>

            <label className="w-full">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                    Email Address <sup className="text-pink-200">*</sup>
                </p>
                <input
                    required
                    type="text"
                    name="email"
                    value={email}
                    onChange={handleOnChange}
                    placeholder="Enter email address"
                    style={{
                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                    }}
                    className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                />
            </label>
            <label className="relative">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                    Password <sup className="text-pink-200">*</sup>
                </p>
                <input
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={handleOnChange}
                    placeholder="Enter Password"
                    style={{
                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                    }}
                    className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5"
                />
                <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                >
                    {showPassword ? (
                        <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                    ) : (
                        <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                    )}
                </span>
                <Link to="/forgot-password">
                    <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
                        Forgot Password
                    </p>
                </Link>
            </label>
            <button
                type="submit"
                className="mt-6 rounded-lg bg-yellow-50 py-3 px-4 font-semibold text-richblack-900 hover:bg-yellow-25 transition-all duration-200"
            >
                Sign In to InterroSpot
            </button>
        </form>
    )
}

export default LoginForm