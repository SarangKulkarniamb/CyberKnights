import React from 'react'
import Navbar from '../components/navbar/Navbar'
import Hero from '../components/heropage/Hero'
import Footer from '../components/footer/Footer'

import { motion } from 'framer-motion'
function Homepage() {

  return (
    <div className="min-h-screen overflow-x-hidden bg-white-50">
      <motion.div
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
        <motion.div
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
            }}>
            <Navbar />
        </motion.div>
        <motion.div
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
            }}>
                <Hero />
        </motion.div>
        
            <Footer />
        
      </motion.div>
    </div>

  )
}

export default Homepage
