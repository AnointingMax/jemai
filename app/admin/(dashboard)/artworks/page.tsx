import Link from "next/link";

import { ArtworkTable, type ArtworkRow } from "@/components/admin/artwork-table";
import { Button } from "@/components/ui/button";
import { artworkMediums, listArtworks } from "@/lib/admin/artworks";
import { formatUpdatedAt } from "@/lib/admin/content";

/**
 * Artworks — the gallery index. The store is read here and flattened to the
 * columns the table draws, so the media and the story HTML never cross to the
 * client.
 */
const AdminArtworksPage = async () => {
  const artworks = await listArtworks();
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

      <ArtworkTable rows={rows} mediums={artworkMediums} />
    </div>
  );
};

export default AdminArtworksPage;
