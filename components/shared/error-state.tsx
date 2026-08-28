import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  /** The large line — "500", "404", or a short word. */
  code: string;
  title: string;
  description: React.ReactNode;
  /** Omitted on a 404, where there is nothing to retry. */
  onRetry?: () => void;
  retryLabel?: string;
  /** Where "go back" leads — the storefront home, or the console overview. */
  homeHref: string;
  homeLabel: string;
  /** The digest Next attaches to a server error, shown so it can be quoted. */
  digest?: string;
  className?: string;
};

/**
 * The one layout behind every error and not-found frame in the app. The trees
 * differ only in what they point at, so the copy is passed in and the shape is
 * not repeated per route.
 */
export const ErrorState = ({
  code,
  title,
  description,
  onRetry,
  retryLabel = "Try again",
  homeHref,
  homeLabel,
  digest,
  className,
}: ErrorStateProps) => (
  <div
    className={cn(
      "flex min-h-[60svh] flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6",
      className,
    )}
  >
    <p className="text-text-secondary font-heading text-5xl leading-none sm:text-6xl lg:text-numeral">
      {code}
    </p>
    <h1 className="text-text-primary font-heading mt-6 text-3xl sm:text-4xl lg:text-h2">
      {title}
    </h1>
    <p className="text-text-secondary text-body mt-4 max-w-prose">{description}</p>

    <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
      {onRetry ? (
        <Button variant="jemai" size="cta" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
      <Button variant="jemai-outline" size="cta" asChild>
        <Link href={homeHref}>{homeLabel}</Link>
      </Button>
    </div>

    {digest ? (
      <p className="text-text-secondary text-body-xs mt-8 font-mono">
        Reference: {digest}
      </p>
    ) : null}
  </div>
);
