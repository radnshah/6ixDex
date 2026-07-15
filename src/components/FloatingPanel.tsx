"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

export function FloatingPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-black/40 backdrop-blur-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}
