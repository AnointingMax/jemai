import Image from "next/image";
import { cn } from "@/lib/utils";

type OrnamentProps = {
  src: string;
  width: number;
  height: number;
  /** Absolute placement against the nearest positioned ancestor. */
  className?: string;
};

/**
 * A decorative festive cut-out — the hanging wreath, the pair of baubles, the
 * reindeer. Every one of them is presentational, so each is `aria-hidden` with
 * an empty alt and sits outside the flow; none of them may take a hit area from
 * the control underneath.
 *
 * They are hidden below `lg`. The Figma file draws desktop frames only, and at
 * phone widths these cut-outs would land on top of the copy rather than beside
 * it.
 */
export const Ornament = ({ src, width, height, className }: OrnamentProps) => (
  <Image
    src={src}
    alt=""
    aria-hidden
    width={width}
    height={height}
    unoptimized
    className={cn(
      "pointer-events-none absolute hidden select-none lg:block",
      className,
    )}
  />
);
