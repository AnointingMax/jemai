import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteArtworkAction } from "@/app/admin/(dashboard)/artworks/actions";
import { ContentActionsMenu } from "@/components/admin/content-actions-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getArtwork } from "@/lib/admin/artworks";

/** The label/value rows under "Details". */
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline justify-between gap-4 py-2">
    <dt className="text-text-secondary text-sm">{label}</dt>
    <dd className="text-text-primary text-sm">{value}</dd>
  </div>
);

/**
 * An artwork's detail screen: the record on the left, its imagery on the right.
 * This is where a create or an edit lands. There is deliberately no price row —
 * the gallery takes enquiries, it does not sell from the site.
 */
const AdminArtworkDetailPage = async ({ params }: PageProps<"/admin/artworks/[slug]">) => {
  const { slug } = await params;
  const artwork = await getArtwork(slug);
  if (!artwork) notFound();

  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
      <Card className="ring-border-default py-6">
        <CardHeader className="gap-3">
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-text-primary font-sans text-xl font-semibold">
              {artwork.title}
            </CardTitle>
            <ContentActionsMenu
              editHref={`/admin/artworks/${artwork.slug}/edit`}
              name={artwork.title}
              deleteLabel="Delete artwork"
              deletedHref="/admin/artworks"
              onDelete={deleteArtworkAction.bind(null, artwork.slug)}
            />
          </div>
          <p className="text-text-secondary max-w-[60ch] text-sm">{artwork.summary}</p>
        </CardHeader>

        <CardContent className="flex flex-col gap-8">
          <section className="flex flex-col gap-1">
            <h2 className="text-text-primary mb-1 text-sm font-semibold">Details</h2>
            <dl className="divide-border-default/60 flex flex-col divide-y">
              <DetailRow label="slug" value={artwork.slug} />
              <DetailRow label="Artist" value={artwork.artist} />
              <DetailRow label="Medium" value={artwork.medium || "—"} />
              <DetailRow label="Year" value={artwork.year || "—"} />
              <DetailRow label="Dimensions" value={artwork.dimensions} />
              <DetailRow label="Curator's Pick" value={artwork.curatorsPick ? "YES" : "NO"} />
            </dl>
          </section>

          {artwork.story ? (
            <Accordion type="multiple" defaultValue={["story"]}>
              <AccordionItem
                value="story"
                className="border-border-default overflow-hidden rounded-lg border"
              >
                <AccordionTrigger className="bg-admin-muted rounded-none px-3 py-2.5 hover:no-underline">
                  <Badge
                    variant="outline"
                    className="border-border-default bg-background text-text-primary h-7 rounded-full px-3 text-xs font-normal"
                  >
                    Story
                  </Badge>
                </AccordionTrigger>
                <AccordionContent className="bg-admin-field h-auto px-4 py-4">
                  {/* Authored in the console's own editor and put through
                      `sanitizeRichText` on every write, so the only markup that
                      can reach here is the toolbar's own. */}
                  <div
                    className="text-text-primary text-sm leading-6 [&_li]:ml-4 [&_li]:list-disc [&_p:not(:last-child)]:mb-4 [&_ul]:my-2 [&_ul]:pl-4"
                    dangerouslySetInnerHTML={{ __html: artwork.story }}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <Card className="ring-border-default py-6">
          <CardHeader>
            <CardTitle className="text-text-primary font-sans text-xl font-semibold">
              Thumbnail
            </CardTitle>
            <div className="col-start-2 row-start-1 justify-self-end">
              <Button variant="outline" size="lg" asChild className="border-border-default h-9 text-sm">
                <Link href={`/admin/artworks/${artwork.slug}/edit`}>Upload</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {artwork.thumbnail ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={artwork.thumbnail}
                alt={artwork.title}
                className="bg-surface-subtle aspect-3/4 w-36 rounded-md object-cover"
              />
            ) : (
              <p className="text-text-secondary text-sm">No thumbnail yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="ring-border-default py-6">
          <CardHeader>
            <CardTitle className="text-text-primary font-sans text-xl font-semibold">
              Media
            </CardTitle>
            <div className="col-start-2 row-start-1 justify-self-end">
              <Button variant="outline" size="lg" asChild className="border-border-default h-9 text-sm">
                <Link href={`/admin/artworks/${artwork.slug}/edit`}>Edit media</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {artwork.media.length ? (
              <ul className="grid grid-cols-3 gap-3">
                {artwork.media.map((src, index) => (
                  <li key={src}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${artwork.title} — view ${index + 2}`}
                      className="bg-surface-subtle aspect-square w-full rounded-md object-cover"
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-text-secondary text-sm">No media yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminArtworkDetailPage;
