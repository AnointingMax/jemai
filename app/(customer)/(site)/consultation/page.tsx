import type { Metadata } from "next";
import { FaqSection, type Faq } from "@/components/consultation/faq";
import { InquiryForm } from "@/components/consultation/inquiry-form";
import {
  ProjectsRail,
  type Project,
} from "@/components/consultation/projects-rail";

export const metadata: Metadata = {
  title: "Consultation | JEMAI",
  description:
    "From private homes to public spaces, discover considered environments shaped around the people, purpose and possibilities within them.",
};

const projects: Project[] = [
  {
    src: "/figma/home/sp-lanier.jpg",
    alt: "A marble hall with fluted columns and chandeliers",
    caption: "Residential · Lagos",
  },
  {
    src: "/figma/home/sp-soho.jpg",
    alt: "A cast-iron building facade at dusk",
    caption: "Hospitality · Lagos",
  },
  {
    src: "/figma/home/sp-bathhouse.jpg",
    alt: "A white loft with a low seating group",
    caption: "Retail · Lagos",
  },
  {
    src: "/figma/home/sp-woods.jpg",
    alt: "A lit glass pavilion in snow at dusk",
    caption: "Workplace · Abuja",
  },
];

/** The frame draws every row collapsed, so the answers are written. */
const faqs: Faq[] = [
  {
    question: "How do I prepare for my consultation?",
    answer:
      "Bring whatever you already have — plans, photographs, a list of rooms, or simply a sense of how you want the space to feel. Nothing needs to be resolved before we speak; the first conversation is where we work out what the project actually is.",
  },
  {
    question: "What is included in the follow-up after my consultation?",
    answer:
      "Within a week you receive a written summary of what we discussed, an outline of the approach we would take, an indicative timeline and a fee proposal. If the project spans more than one discipline, the summary sets out how they would come together.",
  },
  {
    question: "Do you handle procurement and project management?",
    answer:
      "Yes. We can take a project from first conversation through specification, procurement, delivery and installation, coordinating trades and suppliers throughout — or step in for a single stage if the rest is already covered.",
  },
];

const ConsultationPage = () => (
  /* Every seam in this frame is 64px rather than the shell's 80px editorial
     gap, so the page returns one wrapper and spends the shell's gap once, on
     the seam into the Newsletter — same as About and Contact. */
  <div className="flex w-full flex-col gap-16 pt-16">
    <ProjectsRail
      eyebrow="Architecture & Interiors"
      /* The frame really does draw a double space after the ampersand: the run
         measures 465.6 against 469 with it and ~453 without, so it is kept as a
         non-breaking space rather than silently tidied. Reads like a typo in the
         file — drop the \u00a0 if it is. */
      heading={["Spaces Shaped by", "Purpose, &\u00a0 Personality"]}
      copy="From private homes to public spaces, discover considered environments shaped around the people, purpose and possibilities within them."
      projects={projects}
    />

    <InquiryForm
      eyebrow="Inquire"
      heading="Tell us about your space"
      copy="Share the essentials and our team will arrange a considered first conversation."
      email="consultations@jemai.co"
    />

    <FaqSection
      eyebrow="Questions"
      heading="Frequently asked Questions"
      faqs={faqs}
    />
  </div>
);

export default ConsultationPage;
