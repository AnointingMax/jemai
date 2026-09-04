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

/** Copy comes straight from the client's FAQ document. */
const faqs: Faq[] = [
  {
    question:
      "How can JEMAI help turn my vision into a functional and beautiful space?",
    answer:
      "At JEMAI, we translate your ideas, needs, and aspirations into thoughtful design solutions that **balance functionality, aesthetics, comfort, and long-term value**. Whether you have a clear concept or just a starting idea, we work with you to develop **a space that feels uniquely yours**.",
  },
  {
    question:
      "What types of architectural and design projects does JEMAI specialize in?",
    answer:
      "JEMAI works across **residential, commercial, hospitality, office, retail, interior, and mixed-use projects**. Our approach is adaptable, allowing us to develop solutions that respond to the unique requirements, and context of every project.",
  },
  {
    question:
      "How does JEMAI ensure the design reflects my needs, lifestyle, brand, and budget?",
    answer:
      "**We begin by understanding you and the brief of your project**. Through consultation and collaboration, JEMAI identifies your priorities, budget, functional requirements, and aesthetic preferences, then translates them into **a design strategy that delivers the greatest value**.",
  },
  {
    question:
      "What does JEMAI’s design process look like from the initial idea to the final design?",
    answer:
      "Our process typically moves from **design brief → concept development → design refinement → visualization → technical documentation → construction coordination**, depending on the scope of the project. We keep you involved at key stages so you can make informed decisions throughout the process.",
  },
  {
    question: "How much does it cost to work with JEMAI, and what does the fee cover?",
    answer:
      "Our fees are tailored to the scale, complexity, location, and scope of each project. Once we understand your requirements, JEMAI provides **a clear proposal outlining our services, deliverables, fees, and payment structure**, so you know exactly what to expect.",
  },
  {
    question: "How long will it take JEMAI to design and deliver my project?",
    answer:
      "**Every project is different**. The timeline depends on the project’s size, complexity, approvals, level of detailing, and construction requirements. At the beginning of each engagement, **JEMAI establishes a realistic programme** so you have a clear understanding of the expected timeline.",
  },
  {
    question:
      "Can JEMAI help me maximize the value of my property through better design?",
    answer:
      "Absolutely. At JEMAI, we believe **good design should do more than look good — it should create value**. We consider spatial efficiency, functionality, user experience, material choices, environmental response, and long-term usability to help ensure your investment performs both aesthetically and practically.",
  },
  {
    question:
      "Does JEMAI provide 3D visualizations so I can see and understand the design before construction?",
    answer:
      "Yes. JEMAI uses 3D modelling and high-quality visualizations to help you **experience the proposed space before construction begins**. This allows you to understand the design, materials, proportions, and overall atmosphere and make informed decisions early in the process.",
  },
  {
    question:
      "Can JEMAI manage the technical coordination, approvals, consultants, and construction stages of my project?",
    answer:
      "Depending on the agreed scope of services, yes. JEMAI can coordinate with relevant consultants and project stakeholders and provide the necessary architectural documentation and support throughout the project. Our goal is to create **a coordinated and seamless experience from design through delivery**.",
  },
  {
    question: "How do I get started with JEMAI, and what happens after I contact you?",
    answer:
      "Simply reach out to JEMAI with a brief description of your project, its location, and what you hope to achieve. We’ll schedule an initial conversation to understand your needs, discuss the possibilities, and determine the best way to move forward. **Your idea starts with a conversation.**",
  },
];

const ConsultationPage = () => (
  <div className="flex w-full flex-col gap-16 pt-16">
    <ProjectsRail
      eyebrow="JEMAI Designs"
      heading={["Spaces Shaped by", "Purpose, &\u00a0 Personality"]}
      copy="From private homes to public spaces, discover considered environments shaped around the people, purpose and possibilities within them."
      projects={projects}
    />

    <InquiryForm
      eyebrow="Inquire"
      heading="Tell us about your space"
      copy="Share a few essentials, and our team will be in touch to begin the conversation."
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
