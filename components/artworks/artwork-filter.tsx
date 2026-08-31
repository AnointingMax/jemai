import Link from "next/link";
import { cn } from "@/lib/utils";

export const ArtworkFilter = ({
  mediums,
  active,
  total,
}: {
  mediums: string[];
  active?: string;
  total: number;
}) => {
  if (!mediums.length) return null;

  const tabs = [{ label: "All", href: "/artworks", key: undefined as string | undefined }].concat(
    mediums.map((medium) => ({
      label: medium,
      href: `/artworks?medium=${encodeURIComponent(medium)}`,
      key: medium,
    })),
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-page-gutter">
      <div className="mx-auto flex w-full max-w-432 flex-col gap-3">
        <nav aria-label="Artwork mediums">
          <ul className="scrollbar-none flex justify-start gap-5 overflow-x-auto lg:justify-center [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => {
              const current = tab.key === active;
              return (
                <li key={tab.label}>
                  <Link
                    href={tab.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "text-label block border-b pb-1 whitespace-nowrap transition-colors",
                      current
                        ? "border-text-primary text-text-primary"
                        : "text-text-primary/40 hover:text-text-primary/70 border-transparent",
                    )}
                  >
                    {tab.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <p className="text-eyebrow-lg text-text-secondary text-center uppercase">
          {total} {total === 1 ? "piece" : "pieces"}
          {active ? ` in ${active}` : ""}
        </p>
      </div>
    </div>
  );
};
