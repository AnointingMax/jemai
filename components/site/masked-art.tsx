import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type MaskedArtProps = {
  /** Alpha-mask PNG extracted from the Figma frame export. */
  src: string;
  width: number;
  height: number;
  /** Accessible name; omit for decorative art. */
  label?: string;
  /** Tailwind background utility supplying the tint, e.g. `bg-text-inverse`. */
  className?: string;
};

/**
 * Renders light-on-dark artwork as a CSS mask so its colour comes from a theme
 * token rather than being baked into the image.
 */
export const MaskedArt = ({
  src,
  width,
  height,
  label,
  className,
}: MaskedArtProps) => (
  <span
    role={label ? "img" : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
    style={
      {
        width,
        height,
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      } as CSSProperties
    }
    className={cn("inline-block shrink-0", className)}
  />
);
