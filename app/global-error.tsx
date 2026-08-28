"use client";

import { useEffect } from "react";

import "./globals.css";

/**
 * The last boundary: this replaces the root layout, so it renders its own
 * document and cannot lean on the fonts or chrome defined there. It only shows
 * when the root layout itself fails, which is why the markup is deliberately
 * plain — anything it depends on is a thing that might be what broke.
 */
const GlobalError = ({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-surface-page text-text-primary flex min-h-svh flex-col items-center justify-center px-4 text-center">
        <title>Something went wrong — JEMAI</title>
        <p className="text-text-secondary font-heading text-5xl leading-none sm:text-6xl">
          500
        </p>
        <h1 className="font-heading mt-6 text-3xl sm:text-4xl">Something went wrong</h1>
        <p className="text-text-secondary text-body mt-4 max-w-prose">
          The application failed to load. Please try again in a moment.
        </p>
        <button
          type="button"
          onClick={() => retry()}
          className="bg-action-primary text-action-primary-content text-label mt-8 h-12 cursor-pointer px-5 font-semibold"
        >
          Try again
        </button>
        {error.digest ? (
          <p className="text-text-secondary text-body-xs mt-8 font-mono">
            Reference: {error.digest}
          </p>
        ) : null}
      </body>
    </html>
  );
};

export default GlobalError;
