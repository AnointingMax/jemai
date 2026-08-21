import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SectionIntro } from "@/components/site/section-intro";
import { ProductCard, type Product } from "@/components/site/product-card";

const products: Product[] = [
  {
    name: "Mila Velvet Chair",
    category: "Lounge",
    price: "₦218,510",
    image: "/figma/home/p-mila.png",
    href: "/furniture/mila-velvet-chair",
  },
  {
    name: "Alma Accent Chair",
    category: "Lounge",
    price: "₦458,210",
    image: "/figma/home/p-alma.png",
    href: "/furniture/alma-accent-chair",
  },
  {
    name: "Nara Boucle Chair",
    category: "Lounge",
    price: "₦218,510",
    image: "/figma/home/p-nara.png",
    href: "/furniture/nara-boucle-chair",
  },
  {
    name: "Stone Armchair",
    category: "Lounge",
    price: "₦218,510",
    image: "/figma/home/p-stone.png",
    href: "/furniture/stone-armchair",
  },
];

const assurances = [
  {
    icon: "/figma/icons/delivery.svg",
    title: "Considered Delivery",
    copy: "Delivery options designed around the scale, care and destination of your order.",
    cta: { label: "Delivery information", href: "/about#delivery" },
  },
  {
    icon: "/figma/icons/guidance.svg",
    title: "Guidance When You Need It",
    copy: "Questions about dimensions, materials or delivery? Our team is available to help before you place your order.",
    cta: { label: "Contact our team", href: "/contact" },
  },
  {
    icon: "/figma/icons/secure.svg",
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
          {products.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </div>

      <div className="border-border-default flex w-full flex-col border-t border-b px-0 py-stack-loose lg:px-page-gutter">
        {/* One per row on mobile, two-up with the last centred beneath on tablet,
            three across with dividers at the desktop breakpoint. */}
        <div className="flex flex-col justify-center gap-10 md:grid md:grid-cols-2 md:gap-12 lg:flex lg:flex-row lg:gap-section-gap-editorial">
          {assurances.map(({ icon, title, copy, cta }, index) => (
            <Fragment key={title}>
              {index > 0 && (
                <div
                  aria-hidden
                  className="border-border-default hidden w-px self-stretch border-l lg:block"
                />
              )}
              <div
                className={cn(
                  "flex flex-col items-start gap-stack-heading lg:flex-1",
                  index === assurances.length - 1 &&
                    "md:col-span-2 md:justify-self-center md:max-w-[calc(50%-1.5rem)] lg:col-span-1 lg:max-w-none lg:justify-self-stretch",
                )}
              >
                <Image src={icon} alt="" width={48} height={48} unoptimized />
                <div className="flex w-full flex-col gap-stack-compact pt-stack-loose">
                  <h3 className="text-h4 text-text-primary">{title}</h3>
                  <p className="text-body text-text-secondary">{copy}</p>
                </div>
                <Link
                  href={cta.href}
                  className="border-border-default text-label text-text-secondary flex min-h-10 min-w-[50px] items-center justify-center rounded-[4px] border px-5 py-3"
                >
                  {cta.label}
                </Link>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  </section>
);
