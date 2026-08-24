import Image from "next/image";
import Link from "next/link";
import { RegisterButton } from "@/components/exhibitions/register-button";
import { upNext } from "@/lib/exhibitions";
import type { RegisterExhibition } from "@/components/exhibitions/register-modal";

/**
 * The featured block on the upcoming index: a 512px copy column beside a 720px
 * `surface-tint` mat holding the work with 16px of clearance.
 *
 * **The block starts 40px right of the page gutter** (x=104 against a 64px
 * gutter) while closing flush on it, so the row is 104 → 1376. Reproduced as
 * an `lg:pl-10` on the block rather than a second measure.
 */
export const UpNext = ({ exhibition }: { exhibition: RegisterExhibition; }) => (
  <section className="w-full px-4 sm:px-6 lg:px-page-gutter">
    <div className="mx-auto w-full max-w-432 lg:pl-10">
      <div className="grid items-start gap-8 lg:grid-cols-[512fr_720fr] lg:gap-10">
        <div className="lg:pt-[73px]">
          <p className="text-eyebrow-lg text-text-secondary uppercase">
            {upNext.eyebrow}
          </p>
          <h2 className="font-heading text-text-primary mt-1.5 text-3xl font-bold sm:text-h2">
            {upNext.title}
          </h2>
          <p className="text-body text-text-primary mt-[13px] max-w-[512px]">
            {upNext.copy}
          </p>

          <dl className="mt-[17px]">
            {upNext.rows.map((row, index) => (
              <div
                key={row.label}
                className={`border-border-default flex gap-4 border-t py-3 ${
                  index === upNext.rows.length - 1 ? "border-b-0" : ""
                }`}
              >
                <dt className="text-body text-text-secondary w-[103px] shrink-0">
                  {row.label}
                </dt>
                <dd className="text-body text-text-primary">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-[31px] flex flex-wrap items-center gap-6">
            <RegisterButton exhibition={exhibition} />
            <Link
              href={`/exhibitions/${upNext.slug}`}
              className="text-body text-text-primary underline-offset-4 hover:underline"
            >
              View Exhibition
            </Link>
          </div>
        </div>

        <div className="bg-surface-tint p-4">
          <Image
            src={upNext.image.src}
            alt={upNext.image.alt}
            width={upNext.image.width}
            height={upNext.image.height}
            priority
            sizes="(min-width: 1024px) 688px, 100vw"
            className="h-auto w-full"
          />
        </div>
      </div>
    </div>
  </section>
);
