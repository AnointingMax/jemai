import type { Metadata } from "next";
import { AssuranceRow } from "@/components/site/assurance-row";
import { ConsultationCta } from "@/components/site/consultation-cta";
import { Catalogue, CatalogueBreadcrumb } from "@/components/furniture/catalogue";
import { loadCatalogue } from "@/lib/furniture";

export const metadata: Metadata = {
  title: "Furniture | JEMAI",
  description:
    "Each collection we release reflects our dedication to innovative design and exceptional craftsmanship.",
};

const FurniturePage = async ({ searchParams }: PageProps<"/furniture">) => {
  const { collection: raw } = await searchParams;
  const { products, collections } = await loadCatalogue();

  const requested = typeof raw === "string" ? raw : undefined;
  const collection = requested && collections.includes(requested) ? requested : "All";

  return (
    <>
      <section className="flex w-full flex-col pt-3 pb-10 lg:pb-10.25">
        {/* The Nav frame closes on the same 3px rule every section opens with. */}
        <div className="w-full px-4 sm:px-6 lg:px-page-gutter">
          <hr className="border-border-strong mx-auto w-full max-w-432 border-t-3" />
        </div>

        <div className="mt-3 w-full px-4 sm:px-6 lg:px-page-gutter pt-12">
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
          collection={collection}
        />

        <div className="mt-4 w-full px-4 sm:px-6 lg:px-page-gutter">
          <AssuranceRow className="mx-auto max-w-432" />
        </div>
      </section>

      <ConsultationCta panelClassName="lg:w-131.5" />
    </>
  );
};

export default FurniturePage;
