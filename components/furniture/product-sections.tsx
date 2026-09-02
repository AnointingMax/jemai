"use client";

import { Accordion } from "radix-ui";
import { ChevronDownIcon } from "@/components/icons";
import type { ProductSection } from "@/lib/products";

type ProductSectionsProps = {
  sections: ProductSection[];
};

export const ProductSections = ({ sections }: ProductSectionsProps) => (
  <Accordion.Root type="single" collapsible className="flex w-full flex-col">
    {sections.map((section) => (
      <Accordion.Item
        key={section.title}
        value={section.title}
        className="border-border-default border-b"
      >
        <Accordion.Header>
          <Accordion.Trigger className="group text-label text-text-primary flex h-16 w-full items-center justify-between gap-4 text-left font-normal">
            {section.title}
            <ChevronDownIcon
              aria-hidden
              className="text-text-primary w-3 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
            />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <p className="text-body-sm text-text-secondary max-w-[52ch] pb-6">
            {section.body}
          </p>
        </Accordion.Content>
      </Accordion.Item>
    ))}
  </Accordion.Root>
);
