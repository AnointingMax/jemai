"use client";

import { Accordion } from "radix-ui";

export type Faq = { question: string; answer: string };

type FaqSectionProps = {
  eyebrow: string;
  heading: string;
  faqs: Faq[];
};

/**
 * The closing FAQ, on an 860px centred measure.
 *
 * The frame draws all three rows collapsed, so **the answers are written, not
 * transcribed** — the same call `ProductSections` and the About disciplines
 * made. Rows are 65px on a `border-default` rule, with a 20 x 20 hairline box
 * carrying the toggle at the right edge; it becomes a minus when the row opens,
 * which the frame does not draw either.
 */
export const FaqSection = ({ eyebrow, heading, faqs }: FaqSectionProps) => (
  <section className="w-full px-4 pt-10.5 pb-10.25 sm:px-6">
    <div className="mx-auto w-full max-w-215">
      <p className="text-eyebrow text-text-secondary uppercase">{eyebrow}</p>
      <h2 className="font-heading text-text-primary mt-0.75 text-2xl font-bold sm:text-h3">
        {heading}
      </h2>

      <Accordion.Root
        type="single"
        collapsible
        className="mt-10.5 flex w-full flex-col"
      >
        {faqs.map((faq, index) => (
          <Accordion.Item
            key={faq.question}
            value={faq.question}
            className="border-border-default border-b"
          >
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-start gap-0 pt-5.5 pb-4.5 text-left">
                <span className="text-eyebrow text-text-secondary mt-1.5 w-10.25 shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-body text-text-secondary flex-1">
                  {faq.question}
                </span>
                <span
                  aria-hidden
                  className="border-border-default text-text-secondary mt-px flex size-5 shrink-0 items-center justify-center border text-[13px] leading-none"
                >
                  <span className="group-data-[state=open]:hidden">+</span>
                  <span className="hidden group-data-[state=open]:inline">
                    &minus;
                  </span>
                </span>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
              <p className="text-body-sm text-text-secondary max-w-[68ch] pb-6 pl-10.25">
                {faq.answer}
              </p>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  </section>
);
