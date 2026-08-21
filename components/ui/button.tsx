import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex cursor-pointer shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",

        /* ------------------------------------------------------------------
           JEMAI variants. The frames draw square-cornered buttons, so each of
           these resets the shadcn `rounded-lg` rather than inheriting it.
           ------------------------------------------------------------------ */

        /** Filled maroon call-to-action — Add To Cart, Checkout. The frame
            draws the disabled state as the maroon at 32% with the label still
            solid, so it is a background tint rather than an opacity on the
            whole button. */
        jemai:
          "bg-action-primary text-action-primary-content rounded-none hover:bg-action-primary/90 disabled:bg-action-primary/32 disabled:opacity-100",
        /** Maroon outline pill — the cart's empty state. */
        "jemai-outline":
          "border-border-action text-action-secondary-content rounded-full border-2 bg-transparent hover:bg-action-primary hover:text-action-primary-content",
        /** Charcoal fill behind the catalogue's "Load more". Like the greys in
            that frame it sits outside the JEMAI palette with no published
            variable, so it is literal hex — worth raising with the designer. */
        "jemai-ink":
          "rounded-none bg-[#333639] text-white hover:bg-[#333639]/90",
        /** Hairline-bordered chip — colour swatches, size chips, gallery
            thumbnails. Selection reads off `aria-pressed` or `aria-current` so
            the same variant covers toggles and one-of-many rails alike. */
        chip: "border-border-default text-text-secondary rounded-none hover:border-border-strong/60 aria-[current=true]:border-border-strong aria-[current=true]:text-text-primary aria-pressed:border-border-strong aria-pressed:text-text-primary",
        /** Underlined catalogue tab. */
        tab: "text-text-primary/40 rounded-none border-b pb-1 font-normal hover:text-text-primary/70 aria-[current=true]:border-text-primary aria-[current=true]:text-text-primary",
        /** Bare text/icon control — the header's menu, locale and search
            buttons, which carry no chrome of their own. */
        quiet:
          "text-text-primary rounded-none bg-transparent hover:text-action-link",
        /** Inverse pill — the header's Bag button. */
        inverse:
          "bg-surface-inverse text-text-inverse rounded-[2px] backdrop-blur-[7px] hover:bg-surface-inverse/90",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        // JEMAI call-to-action: 48px tall, 20px inline padding, label type
        // (type/desktop/label/default is SemiBold, so it overrides font-medium).
        cta: "h-12 gap-2 px-5 text-label font-semibold has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        // Filter-bar control, sitting flush with the 34px hairline fields.
        field: "text-eyebrow-lg h-[34px] gap-1.5 rounded-[4px] px-3 uppercase",
        // Size chip on the product page: 72 x 40, eyebrow caps.
        chip: "text-eyebrow h-10 w-[72px] uppercase",
        // 40px colour swatch — 4px of padding around the colour block.
        swatch: "size-10 p-1",
        // 80px gallery thumbnail.
        thumb: "size-20 overflow-hidden p-0",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
        // 44px hit target for the header's bare icon controls.
        "icon-touch": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
