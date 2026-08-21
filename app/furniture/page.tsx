import type { Metadata } from "next";
import { AssuranceRow, type Assurance } from "@/components/site/assurance-row";
import { ConsultationCta } from "@/components/site/consultation-cta";
import { GlobeIcon, LockIcon, ReturnIcon } from "@/components/icons";
import { Catalogue, CatalogueBreadcrumb } from "@/components/furniture/catalogue";

export const metadata: Metadata = {
  title: "Furniture | JEMAI",
  description:
    "Each collection we release reflects our dedication to innovative design and exceptional craftsmanship.",
};

const assurances: Assurance[] = [
  {
    icon: <GlobeIcon className="text-icon-action size-8" />,
    title: "Free Shipping",
    copy: "All orders over ₦1,818,510 are delivered to your doorstep at no extra charge.",
    cta: { label: "Shipping Details", href: "/about#delivery" },
  },
  {
    icon: <ReturnIcon className="text-icon-action size-8" />,
    title: "30-Days Free Returns",
    copy: "Enjoy the freedom of stress-free shopping with our hassle-free and return policy.",
    cta: { label: "Return Policy", href: "/about#returns" },
  },
  {
    icon: <LockIcon className="text-icon-action size-8" />,
    title: "Secure Payment",
    copy: "Shop with confidence knowing your information is safeguarded.",
    cta: { label: "More About Payment", href: "/about#payment" },
  },
];

const FurniturePage = () => (
  <>
    <section className="flex w-full flex-col pt-3 pb-10 lg:pb-[41px]">
      {/* The Nav frame closes on the same 3px rule every section opens with. */}
      <div className="w-full px-4 sm:px-6 lg:px-page-gutter">
        <hr className="border-border-strong mx-auto w-full max-w-[1728px] border-t-[3px]" />
      </div>

      <div className="mt-3 w-full px-4 sm:px-6 lg:px-page-gutter">
        <div className="mx-auto flex w-full max-w-[1728px] flex-col items-center text-center">
          <CatalogueBreadcrumb />
          <h1 className="font-heading text-text-primary mt-stack-heading text-4xl sm:text-5xl lg:text-[48px] lg:leading-[56px]">
            All Products
          </h1>
          <p className="text-body-lg text-text-secondary mt-3.5 max-w-[560px]">
            Each collection we release reflects our dedication to innovative
            design and exceptional craftsmanship.
          </p>
        </div>
      </div>

      <Catalogue />

      <div className="mt-4 w-full px-4 sm:px-6 lg:px-page-gutter">
        <AssuranceRow items={assurances} className="mx-auto max-w-[1728px]" />
      </div>
    </section>

    <ConsultationCta panelClassName="lg:w-[526px]" />
  </>
);

export default FurniturePage;
