import Image from "next/image";
import Link from "next/link";
import { SubscribeForm } from "@/components/site/subscribe-form";
import {
  HouseIcon,
  InstagramSolidIcon,
  MailIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/icons";

const explore = [
  { label: "Furniture", href: "/furniture" },
  { label: "Art", href: "/artworks" },
  { label: "Exhibitions", href: "/exhibitions" },
];

const company = [
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  // { label: "JEMAI Journal", href: "/journal" },
];

const contacts = [
  { Icon: PhoneIcon, label: "+234 902 586 6760", href: "tel:+2349025866760" },
  {
    Icon: WhatsAppIcon,
    label: "+234 902 586 6760",
    href: "https://wa.me/2349025866760",
  },
  { Icon: MailIcon, label: "Jemai@hello.com", href: "mailto:Jemai@hello.com" },
  {
    Icon: InstagramSolidIcon,
    label: "@jemaidesigns",
    href: "https://instagram.com/jemaidesigns",
  },
];

/**
 * Footer / Desktop (`240:15716`). The arch-lattice ground is a 300px-wide tile
 * recovered from the frame export — it repeats horizontally at its native size,
 * so at the 1440 design width it lands exactly as drawn.
 */
export const SiteFooter = () => (
  <footer className="bg-surface-footer text-text-inverse mt-section-gap-editorial w-full bg-[url('/figma/brand/footer-pattern.png')] bg-size-[300px_514px] bg-top-left bg-repeat">
    <div className="mx-auto flex w-full max-w-432 flex-col px-4 pt-14 pb-10 sm:px-6 lg:px-page-gutter lg:pt-footer-top lg:pb-footer-bottom">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[341fr_164fr_164fr_292fr_345fr_6fr] lg:gap-0">
        {/* Brand */}
        <div className="flex flex-col gap-7">
          <Link href="/" aria-label="JEMAI home" className="w-fit">
            <span className="flex flex-col gap-1.25">
              <Image
                src="/figma/brand/wordmark-inverse.svg"
                alt="JEMAI"
                width={141}
                height={35}
                unoptimized
              />
              <span
                aria-hidden
                className="text-surface-tint block pl-7.5 text-[9px] leading-none tracking-[0.07em] whitespace-nowrap"
              >
                DESIGN | FURNITURE | ART
              </span>
            </span>
          </Link>
          <p className="text-body-sm text-text-inverse max-w-62.25">
            JEMAI brings furniture, contemporary art, architecture and interior
            design together to create spaces that reflect the people and
            businesses they belong to.
          </p>
        </div>

        {/* Explore */}
        <nav className="flex flex-col gap-4.5" aria-labelledby="footer-explore">
          <h2 id="footer-explore" className="text-body text-text-inverse">
            Explore
          </h2>
          <ul className="flex flex-col gap-2.25 lg:max-w-18">
            {explore.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-body-sm text-text-inverse/80 hover:text-text-inverse block transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Company */}
        <nav className="flex flex-col gap-4.5" aria-labelledby="footer-company">
          <h2 id="footer-company" className="text-body text-text-inverse">
            Company
          </h2>
          <ul className="flex flex-col gap-2.25 lg:max-w-18">
            {company.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-body-sm text-text-inverse/80 hover:text-text-inverse block transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contacts */}
        <div className="flex flex-col gap-4">
          <h2 className="text-body text-text-inverse">Contacts</h2>
          <ul className="flex flex-col gap-3.25">
            {contacts.map(({ Icon, label, href }) => (
              <li key={`${label}-${href}`}>
                <a
                  href={href}
                  className="text-body-sm text-text-inverse group flex items-start gap-2.5"
                >
                  <Icon className="mt-0.5 size-4 shrink-0" />
                  <span className="group-hover:underline">{label}</span>
                </a>
              </li>
            ))}
            <li className="text-body-sm text-text-inverse flex items-start gap-2.5">
              <HouseIcon className="mt-0.5 size-4 shrink-0" />
              <span className="lg:max-w-37.5">
                Plot 1194, Hamza Sakwa Close, Guzape, Abuja, FCT
              </span>
            </li>
          </ul>
        </div>

        {/* Stay updated — alone on the last row once the grid drops to two
            columns, so it spans both rather than leaving half the row empty. */}
        <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1">
          <h2 className="text-h4 text-text-inverse">Stay Updated</h2>
          <p className="text-body text-text-inverse">
            Subscribe to our newsletter and never miss an update, from fresh
            arrivals to exclusive deals tailored just for you.
          </p>
          <SubscribeForm
            id="footer-email"
            source="Footer form"
            className="mt-5"
            inputClassName="text-body bg-surface-tint text-text-primary placeholder:text-text-primary/60 h-14 w-full border-transparent px-4"
            buttonClassName="h-14 w-full"
          >
            <p className="text-body-xs text-text-inverse mt-2">
              By clicking the button you agree to the Terms and Conditions of Service
            </p>
          </SubscribeForm>
        </div>
      </div>

      <hr className="border-border-inverse mt-stack-feature w-full border-t" />

      <div className="mt-stack-default flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-body-sm text-text-inverse">
          &copy; {new Date().getFullYear()} JEMAI INTERNATIONAL LIMITED. All
          rights reserved.
        </p>
        <div className="flex items-center gap-3">
          <Link href="/terms" className="text-body-sm text-text-inverse underline underline-offset-2">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  </footer>
);
