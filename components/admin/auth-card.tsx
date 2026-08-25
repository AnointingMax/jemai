import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The login frame runs a size below the four recovery frames on both runs: a
 * 22px title over 16px copy against 28px over ~18px. Three of the four recovery
 * titles land on their frame's ink exactly at 28px semibold; the copy measures
 * 18.4px, where 18px is the nearest token and every line lands within 3%.
 * Each entry also carries the margins that put the title's ink on the frame's
 * 175px band and the sub-heading on 216.
 */
const titleSizes = {
  default: {
    title: "text-h3 mt-8 leading-9",
    description: "mt-2.5 text-body-lg leading-6",
  },
  sm: { title: "text-h4 mt-[37px]", description: "mt-3 text-body" },
};

type AuthCardProps = {
  title: string;
  /** Sub-heading under the title. Centred, and wraps inside the 360px column. */
  description?: React.ReactNode;
  size?: keyof typeof titleSizes;
  children?: React.ReactNode;
  className?: string;
};

/**
 * The wrapper every admin auth screen shares: wordmark, title, sub-heading and
 * then whatever the screen asks for. The frames are all one 360px column on
 * white, with the wordmark 108px down and the title's ink 43px below it.
 */
export const AuthCard = ({
  title,
  description,
  size = "default",
  children,
  className,
}: AuthCardProps) => (
  <div className={cn("w-full max-w-90", className)}>
    <div className="flex flex-col items-center">
      <Image
        src="/figma/brand/wordmark.svg"
        alt="JEMAI"
        width={96}
        height={24}
        priority
        unoptimized
      />
      <h1
        className={cn(
          "text-text-primary text-center font-semibold",
          titleSizes[size].title
        )}
      >
        {title}
      </h1>
      {description ? (
        <p
          className={cn(
            "text-text-secondary text-center",
            titleSizes[size].description
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
    {children}
  </div>
);
