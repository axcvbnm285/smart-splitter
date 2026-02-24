import { motion } from "framer-motion";

export default function Button({ children, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="px-6 py-2 bg-indigo-600 text-white rounded-xl shadow-lg"
    >
      {children}
    </motion.button>
  );
}
