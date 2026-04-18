"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Heart } from "@/shared/ui/icons";

const AUTO_DISMISS_MS = 2000;

export default function MatchOverlay({ onClose }: { onClose: () => void }) {
  const t = useTranslations("swipe");

  useEffect(() => {
    const timer = setTimeout(onClose, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <motion.div
      className="fixed inset-0 z-200 bg-linear-to-br from-brand-cyan to-brand-purple flex flex-col items-center justify-center text-white"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <Heart className="w-24 h-24 fill-white" />
      </motion.div>
      <h2 className="text-4xl font-black mt-6 mb-2">{t("matchTitle")}</h2>
      <p className="text-white/80 text-lg mb-10">{t("matchSubtitle")}</p>
      <button
        type="button"
        onClick={onClose}
        className="bg-white text-brand-purple font-bold px-8 py-4 rounded-full text-lg hover:scale-105 transition-transform"
      >
        {t("sendMessage")}
      </button>
      <button type="button" onClick={onClose} className="mt-4 text-white/60 font-medium hover:text-white">
        {t("keepSwiping")}
      </button>
    </motion.div>
  );
}
