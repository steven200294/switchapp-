"use client";

import dynamic from "next/dynamic";
import { useSearchStore } from "@/shared/stores/search.store";
import { useProperties } from "@/app/explorer/hooks/useProperties";
import { useRouter } from "next/navigation";

const SearchModal = dynamic(() => import("@/app/explorer/components/search/SearchModal"), { ssr: false });

export default function GlobalSearchModal() {
  const { isOpen, close } = useSearchStore();
  const router = useRouter();
  const { data } = useProperties();
  const properties = data?.properties ?? [];

  if (!isOpen) return null;

  return (
    <SearchModal
      properties={properties}
      onClose={close}
      onSelectProperty={(id) => {
        close();
        router.push(`/explorer/${id}`);
      }}
    />
  );
}
