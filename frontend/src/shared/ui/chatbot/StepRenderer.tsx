"use client";

import type { ChatStep, ChatLabels } from "./types";
import ChipStep from "./steps/ChipStep";
import StepperStep from "./steps/StepperStep";
import AddressStep from "./steps/AddressStep";
import PhotoStep from "./steps/PhotoStep";
import ToggleStep from "./steps/ToggleStep";
import RatingStep from "./steps/RatingStep";
import ActionStep from "./steps/ActionStep";
import TextareaStep from "./steps/TextareaStep";

interface Props {
  step: ChatStep;
  value: unknown;
  onChange: (value: unknown) => void;
  onSubmit: () => void;
  onAction?: (actionId: string) => void;
  labels: ChatLabels;
}

export default function StepRenderer({ step, value, onChange, onSubmit, onAction, labels }: Props) {
  const common = { step, value, onChange, onSubmit, labels };

  switch (step.type) {
    case "chips":
      return <ChipStep {...common} />;
    case "stepper":
      return <StepperStep {...common} />;
    case "address":
      return <AddressStep {...common} />;
    case "photo":
      return <PhotoStep {...common} />;
    case "toggles":
      return <ToggleStep {...common} />;
    case "rating":
      return <RatingStep {...common} />;
    case "textarea":
      return <TextareaStep {...common} />;
    case "actions":
      return <ActionStep step={step} onAction={onAction} />;
    case "info":
      return (
        <button type="button" onClick={onSubmit} className="w-full py-3.5 rounded-2xl bg-brand-dark text-white font-bold text-body-md">
          OK
        </button>
      );
    default:
      return null;
  }
}
