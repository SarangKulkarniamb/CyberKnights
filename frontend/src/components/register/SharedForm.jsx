import { useState ,useEffect ,useNavigate } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Form } from "./Form";

const SharedForm = () => {

    const [role,setRole] =useState("Student")

    const url = `${import.meta.env.VITE_API_URL}/register`

    return (
      <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4">
        <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
            Choose your registration type
        </h1>
        <p className="text-lg text-gray-600 mb-6">
            Please select whether you're registering as a STUDENT or MESS OWNER.
        </p>
        </div>
  
        {/* Buttons for role Selection */}
        <div className="flex justify-center gap-8 mb-6">
          <button
            onClick={() => setRole("Student")}
            className={`relative px-6 py-3 text-lg text-black font-medium rounded-lg transition-all duration-300`}
          >
            Student
            {role ==="Student" && (
              <motion.div
                className="absolute left-0 bottom-0 w-full h-1 bg-blue-500 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            )}
          </button>
  
          <button
            onClick={() => setRole("Mess")}
            className={`relative px-6 py-3 text-lg text-black font-medium rounded-lg transition-all duration-300`}
          >
            Mess
            {role === "Mess" && (
              <motion.div
                className="absolute left-0 bottom-0 w-full h-1 bg-blue-500 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            )}
          </button>
        </div>
  
        {/* role Content */}
        <Form role={role} url={url}/>
      </div>
    );
  };
  
export default SharedForm;