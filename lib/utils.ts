import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

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

/**
 * Spread onto an anchor whose `href` is data rather than a literal: it opens a
 * link that leaves the site in a new tab, and leaves the rest alone. A
 * `mailto:` or `tel:` handed `target="_blank"` fires the OS handler and leaves
 * an empty tab sitting behind it.
 */
export const externalLink = (href: string) =>
  /^https?:/.test(href) ? { target: "_blank" as const, rel: "noreferrer" } : {};
