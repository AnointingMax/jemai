"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Toggle as TogglePrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "group/toggle inline-flex cursor-pointer items-center justify-center gap-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-pressed:bg-muted data-[state=on]:bg-muted dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-muted",

        /** JEMAI chip — the hairline-bordered swatches and size buttons on the
            product page. Selection is a border/ink change, never a fill, so
            the shadcn `bg-muted` on hover and on state must be undone. */
        chip: "border-border-default text-text-secondary rounded-none border bg-transparent hover:border-border-strong/60 hover:bg-transparent hover:text-text-secondary aria-pressed:bg-transparent data-[state=on]:border-2 data-[state=on]:border-border-strong data-[state=on]:bg-transparent data-[state=on]:text-text-primary disabled:cursor-not-allowed disabled:opacity-35",
        /** JEMAI catalogue tab — an underline, not a pill. */
        tab: "text-text-primary/40 rounded-none border-b border-transparent bg-transparent font-normal hover:bg-transparent hover:text-text-primary/70 aria-pressed:bg-transparent data-[state=on]:border-text-primary data-[state=on]:bg-transparent data-[state=on]:text-text-primary",
      },
      size: {
        default:
          "h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        // Size chip on the product page: 72 x 40, eyebrow caps.
        chip: "text-eyebrow h-10 w-[72px] min-w-0 px-0 uppercase",
        // 40px colour swatch — 4px of padding around the colour block.
        swatch: "size-10 min-w-0 p-1",
        // Catalogue tab: label type sitting on its own baseline rule.
        tab: "text-label h-auto min-w-0 px-0 pb-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
