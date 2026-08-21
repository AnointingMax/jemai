import Image from "next/image";
import { SectionIntro } from "@/components/site/section-intro";
import { ProductCard } from "@/components/site/product-card";
import { featuredProducts } from "@/lib/products";
import { AssuranceRow, type Assurance } from "@/components/site/assurance-row";

const assurances: Assurance[] = [
  {
    icon: <Image src="/figma/icons/delivery.svg" alt="" width={48} height={48} unoptimized />,
    title: "Considered Delivery",
    copy: "Delivery options designed around the scale, care and destination of your order.",
    cta: { label: "Delivery information", href: "/about#delivery" },
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
    cta: { label: "Payment information", href: "/about#payment" },
  },
];

export const FurnitureSection = () => (
  <section className="flex w-full flex-col items-center gap-section-gap-editorial">
    <div className="flex w-full max-w-[1728px] flex-col gap-stack-loose px-4 sm:px-6 lg:px-page-gutter">
      <hr className="border-border-strong w-full border-t-[3px]" />

      <div className="flex w-full flex-col items-center gap-stack-loose py-8">
        <SectionIntro
          className="max-w-[1080px]"
          eyebrow="02 / JEMAI Furniture"
          numeral="12"
          heading="New Pieces For The Way You Live Now"
          copy="Meet the latest additions to JEMAI, selected to bring comfort, character and a considered presence to everyday living."
          cta={{ label: "Discover The Collection", href: "/furniture" }}
        />

        <div className="grid w-full grid-cols-1 gap-grid-gutter-compact sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </div>

      <AssuranceRow items={assurances} />
    </div>
  </section>
);
