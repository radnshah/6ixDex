"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogoMark } from "./LogoMark";

export function LogoAnimation() {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setPlay(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="pointer-events-none fixed left-4 top-4 z-40 sm:left-6 sm:top-6">
      <motion.div
        layoutId="brand-logo"
        transition={{ duration: 0.5 }}
      >
        <LogoMark play={play} size={28} />
      </motion.div>
    </div>
  );
}
