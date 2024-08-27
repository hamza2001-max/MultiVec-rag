import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

const MessageBubble = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`flex space-x-5 ${
        message.type === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {message.type === "ai" && (
        <div className="bg-gradient-to-r from-[#00c6ff] via-[#0072ff] to-[#00ffb4] h-fit rounded-full">
          <div className="border-2 border-[#0072ff] bg-white rounded-full h-fit p-1">
            <Bot className="w-5 h-5 text-[#0072ff]" />
          </div>
        </div>
      )}
      <div
        className={`max-w-[60%] rounded-lg px-7 py-4 text-lg ${
          message.type === "user"
            ? "bg-[#6a7eff] text-white"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        <div dangerouslySetInnerHTML={{ __html: message.content }} />
        {message.sources && (
          <div className="mt-2 text-xs text-gray-500">
            <p>Sources:</p>
            <ul className="list-disc list-inside">
              {message.sources.map((source, index) => (
                <li key={index}>{source}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {message.type === "user" && (
        <div className="border-2 border-black rounded-full h-fit p-1">
          <User className="w-5 h-5" />
        </div>
      )}
    </motion.div>
  );
};

export default MessageBubble;