import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | JEMAI",
  description:
    "The terms that govern your use of the JEMAI website, and the purchase of furniture, artworks and design services from JEMAI International Limited.",
};

/** Last substantive revision of the copy below — shown under the title. */
const lastUpdated = "31 August 2026";

type Section = {
  id: string;
  title: string;
  paragraphs?: string[];
  list?: string[];
};

const sections: Section[] = [
  {
    id: "agreement",
    title: "1. Agreement to these terms",
    paragraphs: [
      "These Terms of Service govern your access to and use of the JEMAI website, and any order you place for furniture, artworks, exhibitions or design services through it. The site is operated by JEMAI International Limited, Plot 1194, Hamza Sakwa Close, Guzape, Abuja, FCT, Nigeria.",
      "By browsing the site, creating an account, subscribing to our updates or placing an order, you accept these terms. If you do not accept them, please do not use the site.",
    ],
  },
  {
    id: "eligibility",
    title: "2. Using the site",
    paragraphs: [
      "You must be at least 18 years old, or have the consent of a parent or guardian, to place an order with us. You agree to give accurate information when you order and to keep your account details secure.",
    ],
    list: [
      "Do not use the site for any unlawful purpose, or in a way that interferes with its operation or another visitor's use of it.",
      "Do not attempt to gain unauthorised access to any part of the site, its servers, or any connected system.",
      "Do not copy, scrape or republish our catalogue, photography or written material for commercial use without our written permission.",
    ],
  },
  {
    id: "products",
    title: "3. Products, artworks and availability",
    paragraphs: [
      "Furniture and artworks are frequently one-off, limited or made to order. Photography, dimensions and material descriptions are provided in good faith, but natural materials vary: grain, tone, weave and finish will differ from piece to piece, and screens render colour differently. Small variations of this kind are a feature of the work rather than a fault.",
      "All items are subject to availability. Where a piece sells or is withdrawn after you order it, we will contact you and refund any payment in full.",
    ],
  },
  {
    id: "orders",
    title: "4. Orders and pricing",
    paragraphs: [
      "Your order is an offer to buy. A contract is formed only when we confirm the order in writing. Until then we may decline an order — for example where a piece is no longer available, where a price or description was published in error, or where we are unable to verify payment.",
      "Prices are shown in the currency displayed at checkout and, unless stated otherwise, exclude delivery, installation, duties and taxes, which are shown before you confirm payment. We may change prices at any time, but a change will never affect an order we have already confirmed.",
    ],
  },
  {
    id: "payment",
    title: "5. Payment",
    paragraphs: [
      "Payment is taken through our payment providers at the point of order, unless we have agreed a deposit and balance schedule with you in writing for a commissioned or made-to-order piece. We do not store your full card details. Where a deposit is agreed, it secures your place in the production schedule and is non-refundable once work has begun.",
    ],
  },
  {
    id: "delivery",
    title: "6. Delivery and installation",
    paragraphs: [
      "Delivery timescales quoted on the site or in an order confirmation are estimates. Lead times for made-to-order furniture and commissioned work depend on materials and workshop capacity, and we will keep you informed of any change.",
      "Risk in the goods passes to you on delivery. Please inspect items on arrival and tell us within 7 days of any damage or shortfall, with photographs where possible, so that we can put it right. You are responsible for confirming that access routes, lifts, doorways and the installation site can accommodate the pieces you have ordered.",
    ],
  },
  {
    id: "returns",
    title: "7. Returns and cancellations",
    paragraphs: [
      "You may cancel a standard catalogue order and return the item in its original condition and packaging within 14 days of delivery. Return carriage is at your cost unless the item is faulty or was sent in error. We refund to the original payment method once the item has been received and inspected.",
    ],
    list: [
      "Commissioned, bespoke and made-to-measure pieces cannot be cancelled or returned once production has started.",
      "Original artworks and limited editions are sold as final and are not returnable, except where they arrive damaged or are not as described.",
      "Nothing here affects your statutory rights in respect of goods that are faulty or not as described.",
    ],
  },
  {
    id: "services",
    title: "8. Design and consultation services",
    paragraphs: [
      "Architecture, interior design and consultation work is governed by the separate proposal or letter of engagement we agree with you, which sets out scope, fees, milestones and deliverables. Where that document conflicts with these terms, it takes precedence for that engagement.",
      "Booking a consultation through the site reserves time in our calendar. Please give us at least 48 hours' notice to reschedule or cancel.",
    ],
  },
  {
    id: "ip",
    title: "9. Intellectual property",
    paragraphs: [
      "The JEMAI name and wordmark, the site's design, text, photography and the drawings, specifications and design concepts we produce remain our property or that of the artists and makers we represent. Buying a piece transfers ownership of that physical object only; it does not transfer copyright, reproduction rights or the right to use our imagery commercially.",
    ],
  },
  {
    id: "liability",
    title: "10. Liability",
    paragraphs: [
      "We do not exclude liability for death or personal injury caused by our negligence, for fraud, or for anything else that cannot lawfully be excluded. Subject to that, our total liability in connection with an order is limited to the amount you paid for it, and we are not liable for indirect or consequential loss, including loss of profit or opportunity.",
      "The site is provided as it stands. We aim to keep it accurate and available, but we do not guarantee uninterrupted access or that every detail is free of error.",
    ],
  },
  {
    id: "changes",
    title: "11. Changes to these terms",
    paragraphs: [
      "We may update these terms from time to time. The version published here when you place an order is the version that applies to it, so please review this page before ordering.",
    ],
  },
  {
    id: "law",
    title: "12. Governing law",
    paragraphs: [
      "These terms are governed by the laws of the Federal Republic of Nigeria, and the courts of Nigeria have exclusive jurisdiction over any dispute arising from them.",
    ],
  },
  {
    id: "contact",
    title: "13. Contact us",
    paragraphs: [
      "Questions about these terms, an order or a return can go to admin@jemai.co or +234 902 586 6760, or through the contact page.",
    ],
  },
];

const TermsPage = () => (
  <div className="w-full px-4 pt-16 sm:px-6 lg:px-page-gutter">
    <div className="mx-auto w-full max-w-432">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2">
        <Link
          href="/"
          className="text-body-xs text-text-secondary underline-offset-4 hover:underline"
        >
          Home
        </Link>
        <span aria-hidden className="text-body-xs text-text-secondary">
          /
        </span>
        <span className="text-body-xs text-text-primary" aria-current="page">
          Terms of Service
        </span>
      </nav>

      <header className="mt-6 flex flex-col gap-3 border-b border-border-default pb-8 lg:pb-12">
        <h1 className="font-heading text-text-primary text-4xl sm:text-5xl lg:text-display">
          Terms of Service
        </h1>
        <p className="text-body-lg text-text-secondary max-w-180">
          These terms set out how we work together — what you can expect from
          JEMAI, and what we ask of you when you browse the site, commission a
          piece or place an order.
        </p>
        <p className="text-body-sm text-text-secondary">
          Last updated {lastUpdated}
        </p>
      </header>

      <div className="mt-10 grid gap-12 lg:mt-16 lg:grid-cols-[300fr_812fr] lg:gap-24">
        {/* Contents — a plain list on mobile, a sticky rail alongside the
            copy once there is room for one. */}
        <nav
          aria-labelledby="terms-contents"
          className="lg:sticky lg:top-24 lg:self-start"
        >
          <h2
            id="terms-contents"
            className="text-eyebrow-lg text-text-secondary uppercase"
          >
            Contents
          </h2>
          <ol className="mt-4 flex flex-col gap-2.5">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-body-sm text-text-secondary hover:text-text-primary block transition-colors"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex max-w-180 flex-col gap-10 lg:gap-12">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="flex scroll-mt-24 flex-col gap-4"
            >
              <h2 className="font-heading text-text-primary text-2xl sm:text-h3">
                {section.title}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="text-body text-text-secondary">
                  {paragraph}
                </p>
              ))}
              {section.list && (
                <ul className="flex list-disc flex-col gap-2 pl-5">
                  {section.list.map((item) => (
                    <li key={item} className="text-body text-text-secondary">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <p className="text-body-sm text-text-secondary border-t border-border-default pt-8">
            Prefer to talk it through?{" "}
            <Link
              href="/contact"
              className="text-action-link underline underline-offset-2"
            >
              Contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default TermsPage;
