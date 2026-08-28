import type { Metadata } from "next";

import { ErrorState } from "@/components/shared/error-state";

export const metadata: Metadata = {
  title: "Not found — JEMAI Admin",
};

/** What a `notFound()` from a record screen lands on — a missing slug, usually. */
const AdminNotFound = () => (
  <ErrorState
    className="admin-surface bg-white"
    code="404"
    title="Record not found"
    description="This record has been deleted, or its address has changed since the link was made."
    homeHref="/admin"
    homeLabel="Back to overview"
  />
);

export default AdminNotFound;
