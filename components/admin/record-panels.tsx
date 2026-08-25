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
