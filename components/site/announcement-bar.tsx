import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  XIcon,
} from "@/components/icons";

const socials = [
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
  { label: "X", href: "https://x.com", Icon: XIcon },
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
  { label: "TikTok", href: "https://tiktok.com", Icon: TikTokIcon },
];

export const AnnouncementBar = () => (
  <div className="bg-surface-subtle w-full py-[9.6px]">
    {/* Gutter outside the max width, mirroring SiteHeader, so the socials keep
        their alignment with the nav on screens wider than the 1440 frame. */}
    <div className="w-full px-4 sm:px-6 lg:px-page-gutter">
      <div className="mx-auto flex w-full max-w-432 items-center">
        <ul className="hidden flex-1 items-center gap-grid-gutter pt-1.25 pb-[2.4px] sm:flex">
          {socials.map(({ label, href, Icon }) => (
            <li key={label}>
              <Link
                href={href}
                aria-label={label}
                className="text-icon-primary hover:text-icon-action block transition-colors"
              >
                <Icon className="size-4" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex flex-1 items-end justify-center gap-2 px-4 text-center sm:flex-none">
          <p className="text-body-sm text-text-primary">
            Complimentary design guidance available
          </p>
          <Link
            href="/consultation"
            className="text-body-sm text-action-link underline decoration-solid underline-offset-2"
          >
            Learn more
          </Link>
        </div>

        <div className="hidden h-[23.4px] flex-1 sm:block" />
      </div>
    </div>
  </div>
);
