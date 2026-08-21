import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The JEMAI type scale (`--text-*` in app/globals.css) adds font-size utilities
 * tailwind-merge does not know about. Left unregistered it reads them as text
 * colours — so merging `text-label` with `text-primary-foreground` silently
 * drops the colour and CTAs render in the body colour instead of white.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "h2",
            "h3",
            "h4",
            "body-lg",
            "body",
            "body-sm",
            "body-xs",
            "label",
            "eyebrow",
            "eyebrow-lg",
            "numeral",
          ],
        },
      ],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
