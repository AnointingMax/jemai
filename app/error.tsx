"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/shared/error-state";

/**
 * The app-wide boundary. Anything that throws while rendering a route and is
 * not caught by a boundary closer to it lands here — the reader gets the frame
 * below, and the digest to quote if they get in touch.
 */
const AppError = ({
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
    <ErrorState
      code="500"
      title="Something went wrong"
      description="An unexpected error interrupted this page. Trying again often clears it — if it does not, the reference below tells us where to look."
      onRetry={retry}
      homeHref="/"
      homeLabel="Back to home"
      digest={error.digest}
    />
  );
};

export default AppError;
