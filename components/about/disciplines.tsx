"use client";

import { Accordion } from "radix-ui";
import { ChevronDownIcon } from "@/components/icons";

export type Discipline = {
  /** Doubles as the anchor target — the footer links `/about#design`. */
  id: string;
  title: string;
  body: string;
};

type DisciplinesProps = {
  disciplines: Discipline[];
  /** The frame draws Furniture open on load. */
  defaultOpen?: string;
};

/**
 * The four-discipline accordion. Rows are 61px in the frame — 16px above the
 * label, a 28px line, 17px below — with the chevron pinned right at 16px.
 *
 * Two things the frame does not settle. It draws no rule between the rows, but
 * a bare stack of four labels reads as one block, so the rows carry the same
 * `border-border-default` hairline `ProductSections` uses. And only the
 * Furniture panel is drawn open, so the other three bodies are written rather
 * than transcribed.
 */
export const Disciplines = ({ disciplines, defaultOpen }: DisciplinesProps) => (
  <Accordion.Root
    type="single"
    collapsible
    defaultValue={defaultOpen}
    className="flex w-full flex-col"
  >
    {disciplines.map((discipline) => (
      <Accordion.Item
        key={discipline.id}
        id={discipline.id}
        value={discipline.id}
        className="border-border-default scroll-mt-24 border-b"
      >
        <Accordion.Header>
          <Accordion.Trigger className="group text-text-primary font-heading flex w-full items-center justify-between gap-4 pt-4 pb-[17px] text-left text-[18px] leading-7">
            {discipline.title}
            <ChevronDownIcon
              aria-hidden
              className="text-text-primary w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
            />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
          <p className="text-body text-text-secondary pt-4 pb-4">
            {discipline.body}
          </p>
        </Accordion.Content>
      </Accordion.Item>
    ))}
  </Accordion.Root>
);
