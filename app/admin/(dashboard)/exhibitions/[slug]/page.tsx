import Link from "next/link";
import { notFound } from "next/navigation";

import {
  clearExhibitionImageAction,
  deleteExhibitionAction,
} from "@/app/admin/(dashboard)/exhibitions/actions";
import { ClearImageButton } from "@/components/admin/clear-image-button";
import { ContentActionsMenu } from "@/components/admin/content-actions-menu";
import { CopyPanel, DetailRow } from "@/components/admin/record-panels";
import { StatusBadge } from "@/components/admin/status-badge";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActionResult } from "@/lib/action-result";
import { describeAdmission, exhibitionSpan, getExhibition } from "@/lib/admin/exhibitions";
import { listArtworks } from "@/lib/artworks";

/**
 * One of the two single-image cards: an Upload link into the form, and a trash
 * button that clears the slot on its own.
 */
const ImageCard = ({
  title,
  src,
  editHref,
  onClear,
}: {
  title: string;
  src: string | null;
  editHref: string;
  onClear: () => Promise<ActionResult<string>>;
}) => (
  <Card className="ring-border-default py-6">
    <CardHeader>
      <CardTitle className="text-text-primary font-sans text-xl font-semibold">{title}</CardTitle>
      <div className="col-start-2 row-start-1 flex items-center gap-2 justify-self-end">
        <Button variant="outline" size="lg" asChild className="border-border-default h-9 text-sm">
          <Link href={editHref}>Upload</Link>
        </Button>
        <ClearImageButton
          label={title.toLowerCase()}
          disabled={!src}
          onClear={onClear}
        />
      </div>
    </CardHeader>
    <CardContent>
      {src ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={title}
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
  const exhibition = await getExhibition(slug);
  if (!exhibition) notFound();

  const editHref = `/admin/exhibitions/${exhibition.slug}/edit`;
  const portraits = exhibition.artists.filter((artist) => artist.portrait);
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
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-border-default h-9 text-sm"
              >
                <Link href={`/admin/exhibitions/${exhibition.slug}/attendees`}>
                  Attendees
                </Link>
              </Button>
              <ContentActionsMenu
                name={exhibition.name}
                editHref={editHref}
                deleteLabel="Delete exhibition"
                deletedHref="/admin/exhibitions"
                onDelete={deleteExhibitionAction.bind(null, exhibition.slug)}
              />
            </div>
          </div>
          <p className="text-text-secondary max-w-[60ch] text-sm">{exhibition.summary}</p>
        </CardHeader>

        <CardContent className="flex flex-col gap-8">
          <section className="flex flex-col gap-1">
            <h2 className="text-text-primary mb-1 text-sm font-semibold">Details</h2>
            <dl className="divide-border-default/60 flex flex-col divide-y">
              <DetailRow label="slug" value={exhibition.slug} />
              <DetailRow
                label={exhibition.artists.length > 1 ? "Artists" : "Artist"}
                value={exhibition.artists.map((artist) => artist.name).join(", ") || "—"}
              />
              <DetailRow label="Date" value={exhibitionSpan(exhibition)} />
              <DetailRow label="Venue" value={exhibition.venue || "—"} />
              <DetailRow label="Admission" value={describeAdmission(exhibition.admission)} />
            </dl>
          </section>

          <Accordion type="multiple" defaultValue={["content", "artist-0"]} className="gap-3">
            <CopyPanel
              value="content"
              label="Exhibition detail page content"
              body={exhibition.content}
            />
            {/* One panel per artist, and none for an artist nobody has written
                about yet — the storefront draws exactly the same nothing. */}
            {exhibition.artists.map((artist, index) =>
              artist.bio ? (
                <CopyPanel
                  key={artist.name}
                  value={`artist-${index}`}
                  label={`About ${artist.name}`}
                  body={artist.bio}
                />
              ) : null,
            )}
          </Accordion>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <ImageCard
          title="Thumbnail"
          src={exhibition.thumbnail}
          editHref={editHref}
          onClear={clearExhibitionImageAction.bind(null, exhibition.slug)}
        />
        {/* One card per artist with a portrait; the form is where they are
            added, cleared and reordered. */}
        <GalleryCard title="Artist portraits" editHref={editHref} columns="grid-cols-2">
          {portraits.length ? (
            portraits.map((artist) => (
              <li key={artist.name} className="flex flex-col gap-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={artist.portrait!}
                  alt={artist.name}
                  className="bg-surface-subtle aspect-3/4 w-full rounded-md object-cover"
                />
                <span className="text-text-secondary text-xs">{artist.name}</span>
              </li>
            ))
          ) : (
            <li className="text-text-secondary col-span-2 text-sm">
              No artist portraits yet.
            </li>
          )}
        </GalleryCard>

        <GalleryCard title="Media" editHref={editHref} columns="grid-cols-3">
          {exhibition.media.length ? (
            exhibition.media.map((src, index) => (
              <li key={src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${exhibition.name} — installation view ${index + 1}`}
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
