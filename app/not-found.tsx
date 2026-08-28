import type { Metadata } from "next";

import { ErrorState } from "@/components/shared/error-state";

export const metadata: Metadata = {
  title: "Page not found — JEMAI",
};

const NotFound = () => (
  <ErrorState
    code="404"
    title="Page not found"
    description="This page has moved or never existed. The collection is still where you left it."
    homeHref="/"
    homeLabel="Back to home"
  />
);

export default NotFound;
