import React from 'react'
import { ACCOUNT_TYPE } from '../../../../utils/constants'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSignupData } from '../../../../slices/authSlice'

function SignupForm() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [accountType, setAccountType] = useState(ACCOUNT_TYPE.CANDIDATE)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { firstName, lastName, email, password, confirmPassword } = formData

    const handleOnChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value
        }))
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        const signupData = {
            ...formData,
            accountType,
        }

        dispatch(setSignupData(signupData))

        dispatch()
    }
    return (
        <div>

        </div>
    )
}

export default SignupForm
