import { motion} from "framer-motion";
import { MessageSquare } from "lucide-react";
const WelcomeMessage = () => (
    <div className="h-full flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-[#00c6ff] via-[#0072ff] to-[#00ffb4] p-1 rounded-full mb-6"
      >
        <div className="bg-white p-3 rounded-full">
          <MessageSquare 
          style={{ stroke: "url(#icon-gradient)" }}
          className="w-12 h-12 text-indigo-600" />
        </div>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl font-bold text-gray-800 mb-2"
      >
        Welcome to IMS Assistant!
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-gray-600 max-w-md"
      >
        Start your conversation by typing a message below. Our AI assistant is here to help you with any questions about our company Innovative Marketing Services.
      </motion.p>
    </div>
  );

  export default WelcomeMessage;