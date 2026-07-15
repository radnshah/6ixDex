"use client";

import { useEffect, useRef } from "react";
import { Orbitron } from "next/font/google";
import styles from "./LogoAnimation.module.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["700", "900"],
});

export function LogoAnimation() {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = logoRef.current;
    if (!el) return;
    const timeout = setTimeout(() => {
      el.classList.add(styles.play);
    }, 200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="pointer-events-none fixed left-4 top-4 z-40 sm:left-6 sm:top-6">
      <div ref={logoRef} className={`${styles.logo} ${orbitron.className}`}>
        <span className={styles.letter}>6</span>
        <span className={`${styles.grow} ${styles.ix}`}>IX</span>
        <span className={styles.d}>D</span>
        <span className={`${styles.grow} ${styles.ex}`}>EX</span>
      </div>
    </div>
  );
}
