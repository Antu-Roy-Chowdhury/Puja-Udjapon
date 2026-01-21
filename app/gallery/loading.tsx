"use client"

import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="relative flex items-center justify-center">
        {/* Outer Pulsing Ring */}
        <motion.div
          className="absolute w-16 h-16 border-4 border-primary/20 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Inner Spinner */}
        <motion.div
          className="w-12 h-12 border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 font-serif text-xl text-gray-600 italic tracking-wide"
      >
        Preparing the sanctuary...
      </motion.p>
    </div>
  )
}