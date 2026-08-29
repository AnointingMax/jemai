import type { ReactNode } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";

import { cn } from "@/lib/utils";

export const FormStatus = ({
  error = false,
  className,
  children,
}: {
  error?: boolean;
  className?: string;
  children: ReactNode;
}) => (
  <div
    role={error ? "alert" : "status"}
    aria-live={error ? "assertive" : "polite"}
    className={cn(
      "bg-surface-tint text-body-sm flex items-start gap-2 border-l-3 px-3.5 py-3 font-medium",
      error ? "border-destructive text-destructive" : "border-action-primary text-action-primary",
      className,
    )}
  >
    {error ? (
      <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
    ) : (
      <CircleCheck aria-hidden className="mt-0.5 size-4 shrink-0" />
    )}
    <span>{children}</span>
  </div>
);
