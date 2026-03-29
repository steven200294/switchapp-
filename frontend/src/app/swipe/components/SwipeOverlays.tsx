"use client";

import { motion, type MotionValue } from "framer-motion";

interface SwipeOverlaysProps {
  likeOpacity: MotionValue<number>;
  nopeOpacity: MotionValue<number>;
}

export default function SwipeOverlays({ likeOpacity, nopeOpacity }: SwipeOverlaysProps) {
  return (
    <>
      <motion.div
        className="absolute top-8 left-8 z-10 border-4 border-brand-cyan rounded-2xl px-6 py-2 rotate-[-20deg]"
        style={{ opacity: likeOpacity }}
      >
        <span className="text-brand-cyan text-display-xs font-black">SWITCH</span>
      </motion.div>
      <motion.div
        className="absolute top-8 right-8 z-10 border-4 border-brand-purple rounded-2xl px-6 py-2 rotate-[20deg]"
        style={{ opacity: nopeOpacity }}
      >
        <span className="text-brand-purple text-display-xs font-black">NOPE</span>
      </motion.div>
    </>
  );
}
