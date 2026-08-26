import { SquareArrowOutUpRight } from "lucide-react";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

/** The label/value rows under "Details" on a record's detail screen. */
export const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline justify-between gap-4 py-2">
    <dt className="text-text-secondary text-sm">{label}</dt>
    <dd className="text-text-primary text-sm">{value}</dd>
  </div>
);

/**
 * A long-copy panel, drawn as a labelled, open accordion. Blank lines in the
 * body become paragraphs — the copy fields are plain text, and the frames set
 * multi-paragraph copy with the breaks intact.
 */
export const CopyPanel = ({
  value,
  label,
  body,
}: {
  value: string;
  label: string;
  body: string;
}) => (
  <AccordionItem value={value} className="border-border-default overflow-hidden rounded-lg border">
    <AccordionTrigger className="bg-admin-muted rounded-none px-3 py-2.5 hover:no-underline">
      <Badge
        variant="outline"
        className="border-border-default bg-background text-text-primary h-7 rounded-full px-3 text-xs font-normal"
      >
        {label}
      </Badge>
    </AccordionTrigger>
    <AccordionContent className="text-text-primary bg-admin-field flex h-auto flex-col gap-3 px-4 py-4 font-mono text-sm">
      {body
        .split(/\n{2,}/)
        .filter(Boolean)
        .map((paragraph, index) => (
          <p key={index} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
    </AccordionContent>
  </AccordionItem>
);

/**
 * A hairline card inside a detail sheet, captioned with an eyebrow. The order,
 * enquiry and consultation sheets are all the same stack of these.
 */
export const SheetPanel = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <section className="border-border-default flex flex-col gap-3 rounded-lg border p-4">
    {/* A caption, not a form label — the panels wrap copy, not controls. */}
    <p className="text-text-secondary text-eyebrow-lg uppercase">{label}</p>
    {children}
  </section>
);

/** A contact line: the value, then the icon that opens it in the OS handler. */
export const ContactLink = ({ href, children }: { href: string; children: string }) => (
  <a
    href={href}
    className="text-text-secondary hover:text-text-primary focus-visible:ring-ring/50 flex w-fit items-center gap-2 rounded-sm text-sm outline-none focus-visible:ring-3"
  >
    {children}
    <SquareArrowOutUpRight aria-hidden className="text-action-link size-4" />
  </a>
);
