import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

const LoadingDots = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="flex justify-start space-x-5">
        <div className="border-2 border-black rounded-full h-fit p-1">
          <Bot className="w-5 h-5" />
        </div>
        <div className="bg-gray-100 rounded-lg p-4 ">
          <div className="dot-wave">
            <div className="dot-wave__dot"></div>
            <div className="dot-wave__dot"></div>
            <div className="dot-wave__dot"></div>
            <div className="dot-wave__dot"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingDots;