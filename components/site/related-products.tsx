import { ProductCard, type Product } from "@/components/site/product-card";

type RelatedProductsProps = {
  title?: string;
  products: Product[];
};

/**
 * Heading over a hairline, then the same 316px / 16px gutter grid the
 * catalogue uses — the frame's cards measure identically to `ProductCard`.
 */
export const RelatedProducts = ({
  title = "You May Also Like",
  products,
}: RelatedProductsProps) => (
  <section className="w-full px-4 sm:px-6 lg:px-page-gutter">
    <div className="mx-auto flex w-full max-w-[1728px] flex-col">
      <h2 className="font-heading text-text-primary text-2xl sm:text-h3">
        {title}
      </h2>
      <hr className="border-border-default mt-2.5 border-t" />

      <div className="gap-grid-gutter-compact mt-6 grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.href} product={product} />
        ))}
      </div>
    </div>
  </section>
);
