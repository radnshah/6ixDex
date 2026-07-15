"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogoMark } from "./LogoMark";

// Starting angle is the mark rotated 90deg counterclockwise from its
// upright reading orientation (so it reads roughly as "6" alone).
const START_ANGLE = -90;
const ROTATION_STEP_MS = 1300;
const ROTATION_COUNT = 5;
const SETTLE_MS = 700;

function LoadingDots() {
  return (
    <span className="inline-flex">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.25,
          }}
        >
          .
        </motion.span>
      ))}
    </span>
  );
}

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [angle, setAngle] = useState(START_ANGLE);
  const [rotationsDone, setRotationsDone] = useState(0);

  useEffect(() => {
    if (rotationsDone >= ROTATION_COUNT) {
      const doneTimer = setTimeout(onComplete, SETTLE_MS);
      return () => clearTimeout(doneTimer);
    }
    const stepTimer = setTimeout(() => {
      setAngle((prev) => prev + 90);
      setRotationsDone((prev) => prev + 1);
    }, ROTATION_STEP_MS);
    return () => clearTimeout(stepTimer);
  }, [rotationsDone, onComplete]);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[100] bg-black"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      />
      <div className="pointer-events-none fixed inset-0 z-[101] flex flex-col items-center justify-center gap-4">
        <motion.div
          layoutId="brand-logo"
          initial={{ rotate: START_ANGLE }}
          animate={{ rotate: angle }}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.15, 1] }}
        >
          <LogoMark play={false} size={64} />
        </motion.div>
        <motion.p
          className="text-xs pt-8 font-medium uppercase tracking-[0.2em] text-zinc-500"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          Loading experience
          <LoadingDots />
        </motion.p>
      </div>
    </>
  );
}
