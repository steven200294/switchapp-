"use client";

import dynamic from "next/dynamic";
import { useSearchStore } from "@/shared/stores/search.store";
import { useProperties } from "@/app/[locale]/explorer/hooks/useProperties";

const SearchModal = dynamic(() => import("@/app/[locale]/explorer/components/search/SearchModal"), { ssr: false });

export default function GlobalSearchModal() {
  const { isOpen, close } = useSearchStore();
  const { data } = useProperties();
  const properties = data?.properties ?? [];

  if (!isOpen) return null;

  return (
    <SearchModal
      properties={properties}
      onClose={close}
    />
  );
}
