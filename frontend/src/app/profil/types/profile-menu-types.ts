import type { ComponentType } from "react";

export type ProfileMenuItem = {
  id: string;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  href?: string;
  action?: () => void;
  isDestructive?: boolean;
};
