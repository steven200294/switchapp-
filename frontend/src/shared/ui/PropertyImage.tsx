"use client";

import { useState } from "react";
import { FALLBACK_COVER_HQ } from "@/shared/constants/theme";

interface PropertyImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function PropertyImage({ src, alt, className = "" }: PropertyImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (imgSrc !== FALLBACK_COVER_HQ) setImgSrc(FALLBACK_COVER_HQ);
      }}
    />
  );
}
