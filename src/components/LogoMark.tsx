"use client";

import { useEffect, useRef } from "react";
import { Orbitron } from "next/font/google";
import styles from "./LogoAnimation.module.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["700", "900"],
});

export function LogoMark({
  play,
  size = 28,
  className = "",
}: {
  play: boolean;
  size?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (play && ref.current) {
      ref.current.classList.add(styles.play);
    }
  }, [play]);

  return (
    <div
      ref={ref}
      className={`${styles.logo} ${orbitron.className} ${className}`}
      style={{ fontSize: size }}
    >
      <span className={styles.letter}>6</span>
      <span className={`${styles.grow} ${styles.ix}`}>IX</span>
      <span className={styles.d}>D</span>
      <span className={`${styles.grow} ${styles.ex}`}>EX</span>
    </div>
  );
}
