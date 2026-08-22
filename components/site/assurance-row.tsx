import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type Assurance = {
  /** 48 × 48 mark — an `<Image>` on the home page, an icon component elsewhere. */
  icon: ReactNode;
  title: string;
  copy: string;
  cta: { label: string; href: string };
};

type AssuranceRowProps = {
  items: Assurance[];
  className?: string;
};

/**
 * The three-up reassurance band that closes both the home furniture section and
 * the catalogue. Rules top and bottom, hairline dividers between the columns at
 * desktop; two-up with the last centred beneath on tablet, one per row on mobile.
 */
export const AssuranceRow = ({ items, className }: AssuranceRowProps) => (
  <div
    className={cn(
      "border-border-default flex w-full flex-col border-t border-b px-0 py-stack-loose lg:px-page-gutter",
      className,
    )}
  >
    <div className="flex flex-col justify-center gap-10 md:grid md:grid-cols-2 md:gap-12 lg:flex lg:flex-row lg:gap-section-gap-editorial">
      {items.map(({ icon, title, copy, cta }, index) => (
        <Fragment key={title}>
          {index > 0 && (
            <div
              aria-hidden
              className="border-border-default hidden w-px self-stretch border-l lg:block"
            />
          )}
          <div
            className={cn(
              "flex flex-col items-start gap-stack-heading lg:flex-1",
              index === items.length - 1 &&
                "md:col-span-2 md:max-w-[calc(50%-1.5rem)] md:justify-self-center lg:col-span-1 lg:max-w-none lg:justify-self-stretch",
            )}
          >
            <span className="flex size-12 items-center justify-center">
              {icon}
            </span>
            <div className="flex w-full flex-col gap-stack-compact pt-stack-loose">
              <h3 className="text-h4 text-text-primary">{title}</h3>
              <p className="text-body text-text-secondary">{copy}</p>
            </div>
            <Link
              href={cta.href}
              className="border-border-default text-label text-text-secondary hover:border-border-strong flex min-h-10 min-w-12.5 items-center justify-center rounded-[4px] border px-5 py-3 transition-colors"
            >
              {cta.label}
            </Link>
          </div>
        </Fragment>
      ))}
    </div>
  </div>
);
