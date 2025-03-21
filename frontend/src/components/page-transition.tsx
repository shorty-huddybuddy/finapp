"use client";

import { motion } from "framer-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      // Start from slightly below (y: 20) and fully transparent
      initial={{ opacity: 0, y: 20 }}
      // Animate to final position with full opacity
      animate={{ opacity: 1, y: 0 }}
      // When leaving, fade out and move down
      exit={{ opacity: 0, y: 20 }}
      // Control animation timing and easing
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
