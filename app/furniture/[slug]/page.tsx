import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/furniture/product-gallery";
import { ProductPurchase } from "@/components/furniture/product-purchase";
import { ProductSections } from "@/components/furniture/product-sections";
import { RelatedProducts } from "@/components/site/related-products";
import {
  getProductDetail,
  productDetails,
  relatedProducts,
} from "@/lib/products";

export const generateStaticParams = () =>
  productDetails.map((product) => ({ slug: product.slug }));

export const generateMetadata = async ({
  params,
}: PageProps<"/furniture/[slug]">): Promise<Metadata> => {
  const { slug } = await params;
  const product = getProductDetail(slug);
  if (!product) return { title: "Not found | JEMAI" };

  return {
    title: `${product.name} | JEMAI`,
    description: product.summary,
  };
};

/** This frame separates the crumbs with a slash, not the catalogue's chevron. */
const Slash = () => (
  <span aria-hidden className="text-text-secondary text-body-xs">
    /
  </span>
);

const Breadcrumb = ({ name }: { name: string }) => (
  <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2">
    <Link
      href="/"
      className="text-body-xs text-text-secondary underline-offset-4 hover:underline"
    >
      Home
    </Link>
    <Slash />
    <Link
      href="/furniture"
      className="text-body-xs text-text-secondary underline-offset-4 hover:underline"
    >
      Furniture
    </Link>
    <Slash />
    <span className="text-body-xs text-text-primary" aria-current="page">
      {name}
    </span>
  </nav>
);

const ProductDetailPage = async ({ params }: PageProps<"/furniture/[slug]">) => {
  const { slug } = await params;
  const product = getProductDetail(slug);
  if (!product) notFound();

  return (
    <>
      {/* The frame closes 41px below the last accordion rule, which is what
          separates this block from the 80px editorial gap that follows. */}
      <section className="flex w-full flex-col pt-3 pb-10 lg:pb-[41px]">
        {/* The Nav frame closes on the same 3px rule every section opens with. */}
        <div className="w-full px-4 sm:px-6 lg:px-page-gutter">
          <hr className="border-border-strong mx-auto w-full max-w-[1728px] border-t-[3px]" />
        </div>

        <div className="mt-0.5 w-full px-4 sm:px-6 lg:px-page-gutter">
          <div className="mx-auto w-full max-w-[1728px]">
            <Breadcrumb name={product.name} />
          </div>
        </div>

        <div className="mt-3.5 w-full px-4 sm:px-6 lg:px-page-gutter">
          {/* 660 / 652 of the 1312px inner width, so each `fr` resolves to 1px
              at the 1440 design width and scales everywhere else. The gallery
              panel closes at its own height rather than stretching to the
              taller info column, as the frame draws it. */}
          <div className="mx-auto grid w-full max-w-[1728px] grid-cols-1 items-start lg:grid-cols-[660fr_652fr]">
            <div className="border-border-default border p-6 sm:p-8 lg:p-10">
              <ProductGallery name={product.name} images={product.gallery} />
            </div>

            {/* The frame's divider is two coincident 1px `border-default`
                strokes (composited alpha 0x4b, twice 0x29), so the info column
                carries its own left border beside the panel's right one. */}
            <div className="border-t-border-strong lg:border-l-border-default flex flex-col border-t pt-8 lg:border-l lg:pt-[42px] lg:pr-5 lg:pl-10">
              {/* 28px Classico Bold: the frame's run measures 191 wide and 23
                  of ink, which `text-h3` reproduces (191.6 / 22.1). Regular at
                  26px matches the width but is two units short of the ink. */}
              <h1 className="font-heading text-text-primary text-2xl sm:text-h3">
                {product.name}
              </h1>
              <p className="text-body-lg text-text-primary mt-5">
                {product.price}
              </p>
              <p className="text-body-lg text-text-secondary mt-4 max-w-[540px]">
                {product.summary}
              </p>

              <ProductPurchase product={product} />

              {/* The frame insets this block 20px further than the block above
                  it; kept as a `lg:` nudge rather than a second measure. */}
              <div className="mt-14 lg:mr-5">
                <ProductSections sections={product.sections} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <RelatedProducts products={relatedProducts(product.slug)} />
    </>
  );
};

export default ProductDetailPage;
