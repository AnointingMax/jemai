import type { Metadata } from "next";
import { AssuranceRow, type Assurance } from "@/components/site/assurance-row";
import { ConsultationCta } from "@/components/site/consultation-cta";
import { GlobeIcon, LockIcon, ReturnIcon } from "@/components/icons";
import { Catalogue, CatalogueBreadcrumb } from "@/components/furniture/catalogue";
import { loadCatalogue } from "@/lib/furniture";

export const metadata: Metadata = {
  title: "Furniture | JEMAI",
  description:
    "Each collection we release reflects our dedication to innovative design and exceptional craftsmanship.",
};

/**
 * The frame draws a "learn more" button under each column, pointing at
 * `/about#delivery`, `#returns` and `#payment`. None of those anchors exists —
 * the About page defines only `art`, `design`, `exhibitions` and `furniture` —
 * so all three buttons dropped the reader at the top of a page that never
 * answers the question. The copy stands on its own until there is a shipping,
 * returns or payment page to point at.
 */
const assurances: Assurance[] = [
  {
    icon: <GlobeIcon className="text-icon-action size-8" />,
    title: "Free Shipping",
    copy: "All orders over ₦1,818,510 are delivered to your doorstep at no extra charge.",
  },
  {
    icon: <ReturnIcon className="text-icon-action size-8" />,
    title: "30-Days Free Returns",
    copy: "Enjoy the freedom of stress-free shopping with our hassle-free and return policy.",
  },
  {
    icon: <LockIcon className="text-icon-action size-8" />,
    title: "Secure Payment",
    copy: "Shop with confidence knowing your information is safeguarded.",
  },
];

const FurniturePage = async ({ searchParams }: PageProps<"/furniture">) => {
  const { collection: raw } = await searchParams;
  const { products, collections, colors } = await loadCatalogue();

  // An unknown or stale `?collection=` falls back to "All" rather than to an
  // empty grid — the tab rail then shows All as current, which is the truth.
  const requested = typeof raw === "string" ? raw : undefined;
  const collection = requested && collections.includes(requested) ? requested : "All";

  return (
    <>
      <section className="flex w-full flex-col pt-3 pb-10 lg:pb-10.25">
        {/* The Nav frame closes on the same 3px rule every section opens with. */}
        <div className="w-full px-4 sm:px-6 lg:px-page-gutter">
          <hr className="border-border-strong mx-auto w-full max-w-432 border-t-3" />
        </div>

        <div className="mt-3 w-full px-4 sm:px-6 lg:px-page-gutter">
          <div className="mx-auto flex w-full max-w-432 flex-col items-center text-center">
            <CatalogueBreadcrumb />
            <h1 className="font-heading text-text-primary mt-stack-heading text-4xl sm:text-5xl lg:text-[48px] lg:leading-14">
              All Products
            </h1>
            <p className="text-body-lg text-text-secondary mt-3.5 max-w-140">
              Each collection we release reflects our dedication to innovative
              design and exceptional craftsmanship.
            </p>
          </div>
        </div>

        <Catalogue
          products={products}
          collections={collections}
          colors={colors}
          collection={collection}
        />

        <div className="mt-4 w-full px-4 sm:px-6 lg:px-page-gutter">
          <AssuranceRow items={assurances} className="mx-auto max-w-432" />
        </div>
      </section>

      <ConsultationCta panelClassName="lg:w-131.5" />
    </>
  );
};

export default FurniturePage;
