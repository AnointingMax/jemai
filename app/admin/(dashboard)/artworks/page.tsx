import Link from "next/link";

import { ALL_MEDIUMS, ArtworkTable, type ArtworkRow } from "@/components/admin/artwork-table";
import { Button } from "@/components/ui/button";
import { listArtworks } from "@/lib/admin/artworks";
import { formatUpdatedAt } from "@/lib/admin/content";
import { param, paramOneOf } from "@/lib/admin/table-query";
import { artworkMediumNames } from "@/lib/taxonomy";

/**
 * Artworks — the gallery index. The store is read here and flattened to the
 * columns the table draws, so the media and the story HTML never cross to the
 * client.
 */
const AdminArtworksPage = async ({ searchParams }: PageProps<"/admin/artworks">) => {
  // The search box and the medium filter live in the URL, so the view survives
  // a reload and can be sent to somebody as a link; the narrowing itself runs
  // in the query below rather than over rows already sent.
  const query = await searchParams;
  const search = param(query, "q") ?? "";
  // The vocabulary is managed at /admin/taxonomy, so the filter is read against
  // whatever is in the list now rather than a fixed set compiled into the page.
  const mediums = await artworkMediumNames();
  const medium = paramOneOf(query, "medium", mediums);

  const artworks = await listArtworks({ search, medium });
  const rows: ArtworkRow[] = artworks.map((item) => ({
    slug: item.slug,
    title: item.title,
    artist: item.artist,
    medium: item.medium,
    curatorsPick: item.curatorsPick,
    updatedAt: item.updatedAt,
    updatedLabel: formatUpdatedAt(item.updatedAt),
    thumbnail: item.thumbnail,
  }));

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-text-primary text-2xl font-semibold">Artworks</h1>
          <p className="text-text-secondary max-w-[70ch] text-sm">
            Manage the gallery catalogue. Artwork records never display price or purchase
            actions on the customer-facing site.
          </p>
        </div>
        <Button asChild size="lg" className="h-11 shrink-0 px-5 text-sm">
          <Link href="/admin/artworks/new">Add artwork</Link>
        </Button>
      </header>

      <ArtworkTable
        rows={rows}
        mediums={mediums}
        search={search}
        medium={medium ?? ALL_MEDIUMS}
      />
    </div>
  );
};

export default AdminArtworksPage;
