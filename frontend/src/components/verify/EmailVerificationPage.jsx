import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from 'axios'
import { Toaster } from "react-hot-toast";


export const EmailVerificationPage = () => {
	const url = `${import.meta.env.VITE_API_URL}/verify`
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const [loading, setLoading] = useState(false);
	const inputRefs = useRef([]);
	const navigate = useNavigate();

	const handleChange = (index, value) => {
		const newCode = [...code];

		// Handle pasted content
		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split("");
			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || "";
			}
			setCode(newCode);

			// Focus on the last non-empty input or the first empty one
			const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRefs.current[focusIndex].focus();
		} else {
			newCode[index] = value;
			setCode(newCode);

			// Move focus to the next input field if value is entered
			if (value && index < 5) {
				inputRefs.current[index + 1].focus();
			}
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const data = {
			token: code.join(""),
		};

	
		try {
			const response = await axios.post(url, data);
	
	
			if (!response.data.success) {
				toast.error(response.data.message || "Verification failed.");
			} else {
				toast.success("Verification successful! Redirecting to login page...", { duration: 3000 });
				setTimeout(() => {
					navigate('/login');
				}, 3000);
			}
		} catch (error) {
			toast.error(error?.response?.data?.message || "There was an error with account verification. Please try again.");
		} finally {
			setLoading(false);
		}
	};
	

	return (
		
		<div className='max-w-md w-full shadow-md rounded-2xl overflow-hidden'>
			<div><Toaster /></div>
			<motion.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='rounded-2xl shadow-2xl border px-8 py-20 w-full max-w-md'
			>
				<h2 className='text-3xl font-bold mb-6 text-center text-black'>
					Verify Your Email
				</h2>
				<p className='text-center text-gray mb-6'>Enter the 6-digit code sent to your email address.</p>

				<form onSubmit={handleSubmit} className='space-y-6'>
					<div className='flex justify-between'>
						{code.map((digit, index) => (
							<input
								key={index}
								ref={(el) => (inputRefs.current[index] = el)}
								type='text'
								maxLength='6'
								value={digit}
								onChange={(e) => handleChange(index, e.target.value)}
								onKeyDown={(e) => handleKeyDown(index, e)}
								className='w-12 h-12 text-center text-2xl font-bold text-black border-2 border-gray-600 rounded-lg focus:border-blue-950 focus:outline-none'
							/>
						))}
					</div>
				
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						type='submit'
						disabled={code.some((digit) => !digit)}
						className='w-full bg-blue-950 text-white font-bold py-3 px-4 rounded-lg shadow-lg disabled:opacity-50'
					>
						{loading ? "Submitting" : "Submit"}
					</motion.button>
				</form>
			</motion.div>
		</div>
	);
};
