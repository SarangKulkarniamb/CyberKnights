import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Toaster,toast } from 'react-hot-toast'
import {motion} from 'framer-motion'
import Input from '../register/Input'
import {User,Lock} from 'lucide-react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import {useSetRecoilState} from 'recoil'
import { authState } from '../../atoms/authAtom'

export const Loginform =() =>{

  const url = `${import.meta.env.VITE_API_URL}/login`;
  const [form, setForm] = useState({
      cred : "",
      password : ""
  })
  const setAuthState = useSetRecoilState(authState)
  const [loading , setLoading] =useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.post(url, form, { withCredentials: true });
      
      if (!response.data.success) {
        toast.error(response.data.message);
      } else {
        toast.success('Login successful! Redirecting...', { duration: 2000 });
        setAuthState({ isAuthenticated: true, user: response.data.user });
  
        setTimeout(() => {
          navigate('/'); // Or redirect based on role
        }, 2000);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'There was an error logging in.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className=" flex flex-col justify-center items-center bg-gray-50 h-screen w-full py-10 px-4">

        <div><Toaster /></div>
        <div>
        <motion.div
          key="form1"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className="p-20 bg-white flex flex-col gap-12 items-center border rounded-lg "
        >
          <h2 className="text-2xl font-bold text-gray-700">Login</h2>
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
            <Input
              icon={User}
              type="text"
              name="cred"
              placeholder="Username/Email"
              value={form.cred}
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
            <div className='flex my-2 gap-1'>
              <p className="text-sm text-gray-800"> Haven't registered yet ? Click </p>
              <Link className='text-sm text-blue-600 underline hover:text-blue-700' to = "/register">Register</Link>
            </div>
            

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
            
          </form>
        </motion.div>
      </div> 
    </div>
  )
}
