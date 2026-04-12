"use client";

import { useRouter } from "@/i18n/routing";
import { useMyProperty } from "../hooks/useMyProperty";
import PropertyChatBot from "./components/PropertyChatBot";
import PropertyManageView from "./components/PropertyManageView";
import DraftResumeView from "./components/DraftResumeView";

export default function MonLogementPage() {
  const router = useRouter();
  const { data: property, isLoading } = useMyProperty();

  const handleClose = () => router.push("/profil");

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-100 bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-brand-cyan rounded-full animate-spin" />
      </div>
    );
  }

  if (property?.status === "published") {
    return (
      <div className="fixed inset-0 z-100 bg-white md:bg-gray-50 animate-page-slide-right overflow-y-auto">
        <PropertyManageView property={property} onClose={handleClose} />
      </div>
    );
  }

  if (property?.status === "draft") {
    return (
      <div className="fixed inset-0 z-100 bg-white md:bg-gray-50 animate-page-slide-right">
        <DraftResumeView property={property} onClose={handleClose} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-100 bg-white animate-page-slide-right">
      <PropertyChatBot onClose={handleClose} />
    </div>
  );
}
