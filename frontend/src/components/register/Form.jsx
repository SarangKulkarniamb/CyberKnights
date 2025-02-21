import { useState, useEffect  } from "react"
import { motion } from "framer-motion"
import Input from "./Input"
import { Mail, Lock, User } from "lucide-react"
import { Check, X } from "lucide-react"
import { useSetRecoilState } from "recoil"
import { authState } from "../../atoms/authAtom"
import axios from "axios"
import {toast , Toaster} from "react-hot-toast" // Import toast for notifications
import { useNavigate } from "react-router-dom"


export const Form = ({ role, url }) => {
  // form data object
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    role,
  })
  useEffect(() => {
    setForm((prevForm) => ({ ...prevForm, role })); // Update role when prop changes
  }, [role]);

  // useful states
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState("Weak") // password strength
  const [loading, setLoading] = useState(false) // loading API call
  const navigate = useNavigate()

  // recoil atom for auth state
  const setAuthState = useSetRecoilState(authState)

  // Password strength evaluation
  useEffect(() => {
    const evaluatePasswordStrength = (password) => {
      if (!password) {
        setScore(0)
        setFeedback("Weak")
        return
      }
      let tempScore = 0
      if (password.length > 8) tempScore += 1
      if (/[a-z]/.test(password)) tempScore += 1
      if (/[A-Z]/.test(password)) tempScore += 1
      if (/\d/.test(password)) tempScore += 1
      if (/[^A-Za-z0-9]/.test(password)) tempScore += 1
      setScore(tempScore)
      setFeedback(tempScore <= 2 ? "Weak" : tempScore <= 4 ? "Moderate" : "Strong")
    }
    evaluatePasswordStrength(form.password)
  }, [form.password])

  // feedback color
  const getFeedbackColor = () => {
    if (feedback === "Weak") return "text-red-500"
    if (feedback === "Moderate") return "text-yellow-500"
    if (feedback === "Strong") return "text-green-500"
  }

  // onChange updates form data
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }))
  }

  // form validation
  const validateForm = () => {
    if (!form.username || !form.email || !form.password || !form.role) {
      toast.error("All fields are required.")
      return false
    }
    if (!isValidEmail(form.email)) {
      toast.error("Please enter a valid email address.")
      return false
    }
    return true
  }

  // handling submit to backend
  const handleSubmit = async (e) => {
    e.preventDefault()
  
    // Prevent submission if validation fails
    if (!validateForm()) return
  
    // Prevent submit if password is not strong enough
    if (feedback !== "Strong") {
      toast.error("Password must be strong.")
      return
    }
  
    setLoading(true)
  
    try {
      const response = await axios.post(url, form)
    
      if (!response.data.success) {
        toast.error(response.data.message)
      } else {
        toast.success("Registration successful! Redirecting to verification page...", { duration: 3000 })
        setAuthState({
            user: response.data.user,
        })

        setTimeout(() => {
          navigate('/verify')
        }, 3000)
      }
    } catch (error) {
      console.error("Error during registration:", error)
      toast.error(error?.response?.data?.message || "There was an error with your registration. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // email validation
  const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)

  return (
    <>
      <div><Toaster/></div>
      <div>
        <motion.div
          key="form1"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className="p-10 bg-white flex flex-col items-center rounded-lg shadow-md space-y-4"
        >
          <h2 className="text-xl font-bold text-gray-700">{role}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <Input
              icon={User}
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
            />
            <Input
              icon={Mail}
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
            />
            <Input
              icon={Lock}
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />

            {/* Submit Button */}
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.8 }}
            >
              <button
                type="submit"
                className="flex items-center justify-center text-md bg-blue-950 text-white h-12 w-72 rounded-xl font-medium"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </motion.div>


            {/* Password Strength */}
            <div className="mt-4 flex flex-col items-center">
              <div className="flex gap-5 justify-center">
                <h1>Password Strength:</h1>
                <p className={`${getFeedbackColor()} font-semibold`}>{feedback}</p>
              </div>

              <ul className="flex flex-col mt-4 text-sm gap-2" style={{ minWidth: "350px" }}>
                {/* Password Strength Criteria */}
                {[
                  { check: form.password.length > 8, message: "Contains enough characters" },
                  { check: /[a-z]/.test(form.password), message: "Contains lowercase letters" },
                  { check: /[A-Z]/.test(form.password), message: "Contains uppercase letters" },
                  { check: /\d/.test(form.password), message: "Contains numbers" },
                  { check: /[^A-Za-z0-9]/.test(form.password), message: "Contains special characters" },
                ].map((item, index) => (
                  <li
                    key={index}
                    className={`flex items-center ${item.check ? "text-green-400" : "text-gray-400"}`}
                  >
                    <div className="w-6">
                      {item.check ? <Check className="mr-2" /> : <X className="mr-2" />}
                    </div>
                    <span>{item.check ? item.message : `Password should have ${item.message.toLowerCase()}`}</span>
                  </li>
                ))}
              </ul>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  )
}
