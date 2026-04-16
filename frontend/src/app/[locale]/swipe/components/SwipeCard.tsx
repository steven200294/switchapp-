"use client";

import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { SWIPE_THRESHOLD, resolveStorageUrl, pickCover } from "@/shared/constants/theme";
import PropertyImage from "@/shared/ui/PropertyImage";
import type { DeckProperty } from "../types/swipe.types";
import SwipeOverlays from "./SwipeOverlays";
import SwipeCardInfo from "./SwipeCardInfo";

interface SwipeCardProps {
  property: DeckProperty;
  isTop: boolean;
  stackIndex: number;
  onSwipe: (direction: "like" | "nope") => void;
  onTap: () => void;
}

export default function SwipeCard({ property, isTop, stackIndex, onSwipe, onTap }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const nopeOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

  const scale = 1 - stackIndex * 0.05;
  const translateY = stackIndex * 16;
  const coverImg = resolveStorageUrl(pickCover(property));

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > SWIPE_THRESHOLD) onSwipe("like");
    else if (info.offset.x < -SWIPE_THRESHOLD) onSwipe("nope");
  }

  return (
    <motion.div
      className="absolute inset-x-0 top-0 bottom-0 rounded-4xl shadow-xl overflow-hidden will-change-transform cursor-grab active:cursor-grabbing"
      style={{
        zIndex: 30 - stackIndex,
        y: translateY,
        scale,
        opacity: 1 - stackIndex * 0.2,
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={isTop ? handleDragEnd : undefined}
      onTap={isTop ? onTap : undefined}
      animate={isTop ? undefined : { x: 0, rotate: 0 }}
      exit={{ x: 300, opacity: 0, transition: { duration: 0.3 } }}
    >
      <div className="absolute inset-0">
        <PropertyImage src={coverImg} alt={property.title} className="w-full h-full object-cover" />
      </div>

      {isTop && <SwipeOverlays likeOpacity={likeOpacity} nopeOpacity={nopeOpacity} />}

      <SwipeCardInfo property={property} />
    </motion.div>
  );
}
