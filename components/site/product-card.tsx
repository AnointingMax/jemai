import Image from "next/image";
import Link from "next/link";

export type Product = {
  name: string;
  category: string;
  price: string;
  image: string;
  href: string;
};

type ProductCardProps = {
  product: Product;
  sizes?: string;
};

export const ProductCard = ({ product, sizes }: ProductCardProps) => (
  <Link
    href={product.href}
    className="border-border-default group flex flex-col border-r border-b"
  >
    <div className="relative flex h-[260px] w-full items-center justify-center overflow-hidden bg-[#efede9] sm:h-[300px] lg:h-[340px]">
      <Image
        src={product.image}
        alt={product.name}
        fill
        sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <div className="flex w-full flex-col gap-1 px-4 pt-4 pb-5">
      <p className="text-eyebrow-lg text-text-secondary uppercase">
        {product.category}
      </p>
      <p className="text-body-lg text-text-primary">{product.name}</p>
      <p className="text-body-sm text-text-secondary">{product.price}</p>
    </div>
  </Link>
);
