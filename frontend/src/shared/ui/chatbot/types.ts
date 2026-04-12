import type { ReactNode } from "react";

export interface ChipOption {
  id: string;
  label: string;
  icon?: ReactNode;
  description?: string;
}

export interface StepperConfig {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  suffix?: string;
}

export interface ToggleOption {
  id: string;
  label: string;
  icon?: ReactNode;
}

export interface ActionOption {
  id: string;
  label: string;
  variant: "primary" | "secondary" | "ghost";
}

export interface RatingConfig {
  id: string;
  label: string;
  grades: string[];
}

export type StepType =
  | "chips"
  | "address"
  | "stepper"
  | "photo"
  | "toggles"
  | "rating"
  | "actions"
  | "textarea"
  | "info";

export interface ChatStep {
  id: string;
  type: StepType;
  botMessage: string;
  botSubMessage?: string;
  chips?: ChipOption[];
  multiSelect?: boolean;
  steppers?: StepperConfig[];
  toggles?: ToggleOption[];
  ratings?: RatingConfig[];
  actions?: ActionOption[];
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  formatAnswer?: (value: unknown) => string;
}

export interface ChatEntry {
  id: string;
  role: "bot" | "user";
  content: string;
}

export type ChatData = Record<string, unknown>;

export interface ChatLabels {
  continue: string;
  confirm: string;
  edit: string;
  addPhotos: string;
  cover: string;
  restart: string;
}

export interface StepComponentProps {
  step: ChatStep;
  value: unknown;
  onChange: (value: unknown) => void;
  onSubmit: () => void;
  labels: ChatLabels;
}

export interface ChatBotProps {
  steps: ChatStep[];
  onComplete: (data: ChatData) => void;
  onAction?: (actionId: string, data: ChatData) => void;
  onClose?: () => void;
  introMessage?: string;
  completionMessage?: string;
  storageKey?: string;
  labels: ChatLabels;
}
