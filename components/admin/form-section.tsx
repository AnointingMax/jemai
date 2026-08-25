"use client";

import { Minus, Plus } from "lucide-react";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type FormSectionProps = {
  value: string;
  title: string;
  /** Draws the red asterisk the frames put beside a mandatory section. */
  required?: boolean;
  /** Sits under the title once the section is open, never while collapsed. */
  description?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * One collapsible band of the product form. The frames swap a plus for a minus
 * rather than rotating a chevron, so the primitive's own icons are hidden and
 * the pair below reads the trigger's `aria-expanded` instead.
 */
export const FormSection = ({
  value,
  title,
  required,
  description,
  children,
}: FormSectionProps) => (
  <AccordionItem value={value} className="border-border-default border-b">
    <AccordionTrigger className="group/section rounded-none pt-5 pb-3 hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden">
      <span className="text-text-primary flex-1 text-base font-semibold">
        {title}
        {required ? (
          <span className="text-[#e11d48]" aria-hidden>
            *
          </span>
        ) : null}
        {required ? <span className="sr-only"> (required)</span> : null}
      </span>
      <Plus
        aria-hidden
        className="text-text-primary size-5 shrink-0 group-aria-expanded/accordion-trigger:hidden"
      />
      <Minus
        aria-hidden
        className="text-text-primary hidden size-5 shrink-0 group-aria-expanded/accordion-trigger:block"
      />
    </AccordionTrigger>
    <AccordionContent className="h-auto pt-0 pb-8">
      {description ? (
        <p className="text-text-secondary mb-6 text-sm">{description}</p>
      ) : null}
      {children}
    </AccordionContent>
  </AccordionItem>
);

/** The uppercase micro-label the form frames put above every control. */
export const FieldLabel = ({
  htmlFor,
  children,
  required,
  className,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) => (
  <label
    htmlFor={htmlFor}
    className={cn("text-text-secondary text-eyebrow-lg uppercase", className)}
  >
    {children}
    {required ? (
      <span className="text-[#e11d48]" aria-hidden>
        *
      </span>
    ) : null}
  </label>
);

/** Field chrome shared by the inputs, selects and textareas in this form. */
export const fieldChrome =
  "bg-admin-field border-border-default text-text-primary placeholder:text-text-secondary rounded-lg";

/** A field's help text, or its validation message when one is present. */
export const FieldHint = ({ error, children }: { error?: string; children?: React.ReactNode }) =>
  error ? (
    <p className="text-[#e11d48] text-xs">{error}</p>
  ) : children ? (
    <p className="text-text-secondary text-xs whitespace-pre-line">{children}</p>
  ) : null;
