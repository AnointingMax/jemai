import { notFound } from "next/navigation";

import { updateExhibitionAction } from "@/app/admin/(dashboard)/exhibitions/actions";
import { ExhibitionForm, type ExhibitionFormValues } from "@/components/admin/exhibition-form";
import { toContentAsset } from "@/lib/admin/content";
import { getExhibition } from "@/lib/admin/exhibitions";
import { listArtworks } from "@/lib/artworks";

/**
 * Edit — the same form, handed the exhibition as defaults. The action is the
 * update one with the current slug bound to it, so a renamed show still
 * resolves.
 */
const AdminExhibitionEditPage = async ({
  params,
}: PageProps<"/admin/exhibitions/[slug]/edit">) => {
  const { slug } = await params;
  const exhibition = await getExhibition(slug);
  if (!exhibition) notFound();

  const values: ExhibitionFormValues = {
    name: exhibition.name,
    slug: exhibition.slug,
    artist: exhibition.artist,
    startDate: exhibition.startDate,
    endDate: exhibition.endDate,
    venue: exhibition.venue,
    admission: exhibition.admission.paid ? "paid" : "free",
    price: exhibition.admission.price ? String(exhibition.admission.price) : "",
    summary: exhibition.summary,
    content: exhibition.content,
    artistBio: exhibition.artistBio,
    thumbnail: exhibition.thumbnail ? [toContentAsset(exhibition.thumbnail)] : [],
    artistProfile: exhibition.artistProfile
      ? [toContentAsset(exhibition.artistProfile)]
      : [],
    media: exhibition.media.map(toContentAsset),
    featured: exhibition.featured,
  };

  return (
    <ExhibitionForm
      exhibition={values}
      artworks={await listArtworks()}
      action={updateExhibitionAction.bind(null, exhibition.slug)}
      cancelHref={`/admin/exhibitions/${exhibition.slug}`}
      heading={`Edit ${exhibition.name}`}
      submitLabel="Save changes"
    />
  );
};

export default AdminExhibitionEditPage;
