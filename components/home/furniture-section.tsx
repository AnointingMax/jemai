import Image from "next/image";
import { SectionIntro } from "@/components/site/section-intro";
import { ProductCard, type Product } from "@/components/site/product-card";
import { AssuranceRow, type Assurance } from "@/components/site/assurance-row";

/**
 * Two of the three "learn more" buttons pointed at `/about#delivery` and
 * `#payment`, anchors that exist on no page, so they are gone — see the note on
 * the furniture catalogue's own row. Only "Contact our team" had a real
 * destination, which is why this row now draws one button rather than three.
 */
const assurances: Assurance[] = [
  {
    icon: <Image src="/figma/icons/delivery.svg" alt="" width={48} height={48} unoptimized />,
    title: "Considered Delivery",
    copy: "Delivery options designed around the scale, care and destination of your order.",
  },
  {
    icon: <Image src="/figma/icons/guidance.svg" alt="" width={48} height={48} unoptimized />,
    title: "Guidance When You Need It",
    copy: "Questions about dimensions, materials or delivery? Our team is available to help before you place your order.",
    cta: { label: "Contact our team", href: "/contact" },
  },
  {
    icon: <Image src="/figma/icons/secure.svg" alt="" width={48} height={48} unoptimized />,
    title: "Secure checkout",
    copy: "Complete your purchase through a protected online payment process.",
  },
];

/** The four newest pieces, read on the server by the page that renders this. */
export const FurnitureSection = ({ products }: { products: Product[] }) => (
  <section className="flex w-full flex-col items-center gap-section-gap-editorial">
    <div className="flex w-full max-w-432 flex-col gap-stack-loose px-4 sm:px-6 lg:px-page-gutter">
      <hr className="border-border-strong w-full border-t-3" />

      <div className="flex w-full flex-col items-center gap-stack-loose py-8">
        <SectionIntro
          className="max-w-270"
          eyebrow="02 / JEMAI Furniture"
          numeral="12"
          heading="New Pieces For The Way You Live Now"
          copy="Meet the latest additions to JEMAI, selected to bring comfort, character and a considered presence to everyday living."
          cta={{ label: "Discover The Collection", href: "/furniture" }}
        />

        <div className="grid w-full grid-cols-1 gap-grid-gutter-compact sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.href} product={product} />
          ))}
        </div>
      </div>

      <AssuranceRow items={assurances} />
    </div>
  </section>
);
