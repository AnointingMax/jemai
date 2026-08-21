"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Minus, Plus } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

/**
 * The [-] n [+] control the frames draw in the cart and on the product page.
 * It is a shadcn `InputGroup` — a real number field with the two steppers as
 * addons — rather than a span between two buttons, so the count can be typed
 * and is announced as a field.
 *
 * The two call sites differ only in scale, so they are a size variant here
 * instead of two hand-rolled boxes.
 */
const stepperVariants = cva(
  "border-border-default w-fit shrink-0 items-stretch bg-transparent has-disabled:bg-transparent has-disabled:opacity-100 dark:bg-transparent",
  {
    variants: {
      size: {
        /** Cart line: 75 x 29, 2px corners. */
        sm: "h-[29px] w-[75px] rounded-[2px]",
        /** Product page: 143 x 57, square. */
        lg: "h-[57px] w-[143px] rounded-none",
      },
    },
    defaultVariants: { size: "lg" },
  }
);

/**
 * The addons carry the whole hit area, so their padding and the negative
 * margin shadcn uses to tuck a button into an addon both go, and each addon
 * takes an equal share of the box.
 */
const addonClass =
  "flex-1 px-0 py-0 has-[>button]:mx-0 has-[>button]:ml-0 has-[>button]:mr-0";

/** `size-full` — not `h-full` — so it beats the icon size on `InputGroupButton`. */
const buttonClass =
  "text-text-primary size-full rounded-none bg-transparent hover:bg-transparent disabled:opacity-30";

type QuantityStepperProps = VariantProps<typeof stepperVariants> & {
  value: number;
  onChange: (value: number) => void;
  /** What is being counted — used to disambiguate the a11y labels. */
  label: string;
  min?: number;
  max?: number;
  className?: string;
};

export const QuantityStepper = ({
  value,
  onChange,
  label,
  min = 1,
  max,
  size,
  className,
}: QuantityStepperProps) => {
  const ceiling = max ?? Number.POSITIVE_INFINITY;
  const clamp = (next: number) => Math.min(ceiling, Math.max(min, next));
  const icon = size === "sm" ? "size-3" : "size-4";

  return (
    <InputGroup className={cn(stepperVariants({ size }), className)}>
      <InputGroupAddon align="inline-start" className={addonClass}>
        <InputGroupButton
          size="icon-sm"
          aria-label={`Decrease quantity of ${label}`}
          disabled={value <= min}
          onClick={() => onChange(clamp(value - 1))}
          className={cn(buttonClass, "text-text-secondary")}
        >
          <Minus className={icon} strokeWidth={1.5} />
        </InputGroupButton>
      </InputGroupAddon>

      <InputGroupInput
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        aria-label={`Quantity of ${label}`}
        onChange={(event) => {
          // An empty field mid-edit is not a quantity — hold the last value
          // rather than snapping to the minimum under the caret.
          if (event.target.value === "") return;
          const next = Number(event.target.value);
          if (Number.isFinite(next)) onChange(clamp(next));
        }}
        className={cn(
          "text-text-primary h-full px-0 text-center",
          size === "sm" ? "text-body-xs" : "text-body-sm",
          // Native spinners would double up on the two stepper buttons.
          "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        )}
      />

      <InputGroupAddon align="inline-end" className={addonClass}>
        <InputGroupButton
          size="icon-sm"
          aria-label={`Increase quantity of ${label}`}
          disabled={value >= ceiling}
          onClick={() => onChange(clamp(value + 1))}
          className={buttonClass}
        >
          <Plus className={icon} strokeWidth={1.5} />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};
