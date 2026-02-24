import { motion } from "framer-motion";

export default function AnimatedNumber({ value }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      ₹{value.toFixed(2)}
    </motion.span>
  );
}
