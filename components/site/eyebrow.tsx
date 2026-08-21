import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** type/desktop/label/eyebrow — the numbered section kicker used across the site. */
export const Eyebrow = ({ className, ...props }: ComponentProps<"p">) => (
  <p
    className={cn(
      "text-eyebrow text-text-secondary uppercase",
      className,
    )}
    {...props}
  />
);
