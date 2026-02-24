import { motion } from "framer-motion";

export default function PageWrapper({ children }) {
  return (
    <div className="relative min-h-screen flex justify-center items-start py-12 px-4 overflow-hidden">

      {/* Floating Background Blobs */}
      <div className="blob w-72 h-72 bg-purple-300 top-10 left-10"></div>
      <div className="blob w-72 h-72 bg-indigo-300 bottom-10 right-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-4xl space-y-6"
      >
        {children}
      </motion.div>
    </div>
  );
}
