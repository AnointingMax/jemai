import Link from "next/link";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { socials } from "@/lib/contact";

/** The two channels JEMAI publishes, in the order the bar draws them. */
const bar = [
  { ...socials.instagram, Icon: InstagramIcon },
  { ...socials.whatsapp, Icon: WhatsAppIcon },
];

export const AnnouncementBar = () => (
  <div className="bg-surface-subtle w-full py-[9.6px]">
    <div className="w-full px-4 sm:px-6 lg:px-page-gutter">
      <div className="mx-auto flex w-full max-w-432 items-center">
        <ul className="hidden flex-1 items-center gap-grid-gutter pt-1.25 pb-[2.4px] sm:flex">
          {bar.map(({ label, href, Icon }) => (
            <li key={label}>
              <Link
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
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
