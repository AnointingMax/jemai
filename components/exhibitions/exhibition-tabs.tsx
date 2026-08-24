import Link from "next/link";

/**
 * The two-tab row both index frames carry between the hero and the listing:
 * full-bleed 2px `border-default` rules top and bottom, labels on the page
 * gutter, and the active tab underlined in `action-primary`.
 */
export const ExhibitionTabs = ({ active }: { active: "upcoming" | "past"; }) => (
  <nav
    aria-label="Exhibitions"
    className="border-border-default w-full border-y-2"
  >
    <div className="w-full px-4 sm:px-6 lg:px-page-gutter">
      <ul className="mx-auto flex w-full max-w-432 gap-9 py-2.25">
        {(
          [
            { href: "/exhibitions", label: "Upcoming Exhibitions", key: "upcoming" },
            { href: "/exhibitions/past", label: "Past Exhibitions", key: "past" },
          ] as const
        ).map((tab) => (
          <li key={tab.key}>
            <Link
              href={tab.href}
              aria-current={tab.key === active ? "page" : undefined}
              className={
                tab.key === active
                  ? "text-body-lg text-action-link underline decoration-1 underline-offset-4"
                  : "text-body-lg text-text-primary underline-offset-4 hover:underline"
              }
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </nav>
);
