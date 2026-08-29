import Link from "next/link";
import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";

import {
  clearExhibitionImageAction,
  deleteExhibitionAction,
} from "@/app/admin/(dashboard)/exhibitions/actions";
import { ContentActionsMenu } from "@/components/admin/content-actions-menu";
import { CopyPanel, DetailRow } from "@/components/admin/record-panels";
import { StatusBadge } from "@/components/admin/status-badge";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ContentAsset } from "@/lib/admin/content";
import { describeAdmission, exhibitionSpan, getExhibition } from "@/lib/admin/exhibitions";
import { listArtworks } from "@/lib/artworks";

/**
 * One of the two single-image cards: an Upload link into the form, and a trash
 * button that clears the slot on its own. The button is a plain submit inside a
 * form, so the card stays a server component.
 */
const ImageCard = ({
  title,
  asset,
  editHref,
  onClear,
}: {
  title: string;
  asset: ContentAsset | null;
  editHref: string;
  onClear: () => Promise<void>;
}) => (
  <Card className="ring-border-default py-6">
    <CardHeader>
      <CardTitle className="text-text-primary font-sans text-xl font-semibold">{title}</CardTitle>
      <div className="col-start-2 row-start-1 flex items-center gap-2 justify-self-end">
        <Button variant="outline" size="lg" asChild className="border-border-default h-9 text-sm">
          <Link href={editHref}>Upload</Link>
        </Button>
        <form action={onClear}>
          <Button
            type="submit"
            variant="outline"
            size="icon"
            disabled={!asset}
            aria-label={`Remove ${title.toLowerCase()}`}
            className="border-border-default text-text-secondary hover:text-[#e11d48] size-9"
          >
            <Trash2 />
          </Button>
        </form>
      </div>
    </CardHeader>
    <CardContent>
      {asset ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={asset.src}
          alt={asset.name}
          className="bg-surface-subtle aspect-4/3 w-38 rounded-md object-cover"
        />
      ) : (
        <p className="text-text-secondary text-sm">Nothing uploaded yet.</p>
      )}
    </CardContent>
  </Card>
);

/** A media card: a titled grid with one "Edit media" link back into the form. */
const GalleryCard = ({
  title,
  editHref,
  columns,
  children,
}: {
  title: string;
  editHref: string;
  columns: string;
  children: React.ReactNode;
}) => (
  <Card className="ring-border-default py-6">
    <CardHeader>
      <CardTitle className="text-text-primary font-sans text-xl font-semibold">{title}</CardTitle>
      <div className="col-start-2 row-start-1 justify-self-end">
        <Button variant="outline" size="lg" asChild className="border-border-default h-9 text-sm">
          <Link href={editHref}>Edit media</Link>
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <ul className={`grid gap-3 ${columns}`}>{children}</ul>
    </CardContent>
  </Card>
);

/**
 * An exhibition's detail screen: the record on the left, its imagery on the
 * right. This is where a create or an edit lands.
 */
const AdminExhibitionDetailPage = async ({ params }: PageProps<"/admin/exhibitions/[slug]">) => {
  const { slug } = await params;
  const exhibition = getExhibition(slug);
  if (!exhibition) notFound();

  const editHref = `/admin/exhibitions/${exhibition.slug}/edit`;
  const artworks = await listArtworks();
  const featured = exhibition.featured
    .map((held) => artworks.find((artwork) => artwork.slug === held))
    .filter((artwork) => artwork !== undefined);

  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
      <Card className="ring-border-default py-6">
        <CardHeader className="gap-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col items-start gap-2">
              <CardTitle className="text-text-primary font-sans text-xl font-semibold">
                {exhibition.name}
              </CardTitle>
              <StatusBadge status={exhibition.status} />
            </div>
            <ContentActionsMenu
              name={exhibition.name}
              editHref={editHref}
              deleteLabel="Delete exhibition"
              onDelete={deleteExhibitionAction.bind(null, exhibition.slug)}
            />
          </div>
          <p className="text-text-secondary max-w-[60ch] text-sm">{exhibition.summary}</p>
        </CardHeader>

        <CardContent className="flex flex-col gap-8">
          <section className="flex flex-col gap-1">
            <h2 className="text-text-primary mb-1 text-sm font-semibold">Details</h2>
            <dl className="divide-border-default/60 flex flex-col divide-y">
              <DetailRow label="slug" value={exhibition.slug} />
              <DetailRow label="Artist" value={exhibition.artist || "—"} />
              <DetailRow label="Date" value={exhibitionSpan(exhibition)} />
              <DetailRow label="Venue" value={exhibition.venue || "—"} />
              <DetailRow label="Admission" value={describeAdmission(exhibition.admission)} />
            </dl>
          </section>

          <Accordion type="multiple" defaultValue={["content", "artist"]} className="gap-3">
            <CopyPanel
              value="content"
              label="Exhibition detail page content"
              body={exhibition.content}
            />
            <CopyPanel value="artist" label="About the Artist" body={exhibition.artistBio} />
          </Accordion>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <ImageCard
          title="Thumbnail"
          asset={exhibition.thumbnail}
          editHref={editHref}
          onClear={clearExhibitionImageAction.bind(null, exhibition.slug, "thumbnail")}
        />
        <ImageCard
          title="Artist profile"
          asset={exhibition.artistProfile}
          editHref={editHref}
          onClear={clearExhibitionImageAction.bind(null, exhibition.slug, "artistProfile")}
        />

        <GalleryCard title="Media" editHref={editHref} columns="grid-cols-3">
          {exhibition.media.length ? (
            exhibition.media.map((asset) => (
              <li key={asset.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.src}
                  alt={asset.name}
                  className="bg-surface-subtle aspect-square w-full rounded-md object-cover"
                />
              </li>
            ))
          ) : (
            <li className="text-text-secondary col-span-3 text-sm">No media yet.</li>
          )}
        </GalleryCard>

        <GalleryCard title="Featured Artworks" editHref={editHref} columns="grid-cols-2">
          {featured.length ? (
            featured.map((artwork) => (
              <li key={artwork.slug}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={artwork.src}
                  alt={artwork.title}
                  className="bg-surface-subtle aspect-4/3 w-full rounded-md object-cover"
                />
              </li>
            ))
          ) : (
            <li className="text-text-secondary col-span-2 text-sm">
              No artworks linked to this exhibition.
            </li>
          )}
        </GalleryCard>
      </div>
    </div>
  );
};

export default AdminExhibitionDetailPage;
