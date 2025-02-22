import React from 'react'
import Swipe from './Swipe'
import { motion } from 'framer-motion'
const Hero = () => {
  return (
    <>
        <div className='container mt-16 flex flex-col lg:flex-row items-center justify-center gap-12 py-12'>

            {/* Hero Section */}
                <motion.div
                    className='flex flex-col gap-8 text-center'
                    variants={{
                        hidden: { opacity: 1 },
                        visible: {
                            opacity: 1,
                            transition: {
                            staggerChildren: 0.5,
                            },
                        },
                        }}
                    initial="hidden"
                    animate="visible"
                    >
                    <motion.h1
                        className="text-4xl lg:text-5xl text-center font-bold text-blue-950"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                duration: 0.8,
                                ease: "easeInOut",
                                },
                            },
                            }}
                    >
                        Preserve Today, Relive Tomorrow
                    </motion.h1>
                    <motion.p
                        className="text-lg lg:text-xl text-center text-gray-700 mt-4"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                duration: 0.8,
                                ease: "easeInOut",
                                },
                            },
                            }}
                    >
                        Create your own digital time capsule and share it with the future.
                    </motion.p>
                </motion.div>

        </div>
        {/* Swipe Section */}
        <div>
            <Swipe/>
        </div>
    </>
  )
}

export default Hero