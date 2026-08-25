import { createArtworkAction } from "@/app/admin/(dashboard)/artworks/actions";
import { ArtworkForm } from "@/components/admin/artwork-form";
import { artworkMediums, artworkYears } from "@/lib/admin/artworks";

/** Add new Artwork — the create half of the shared artwork form. */
const AdminArtworkNewPage = () => (
  <ArtworkForm
    mediums={artworkMediums}
    years={artworkYears}
    action={createArtworkAction}
    cancelHref="/admin/artworks"
    heading="Add new Artwork"
    submitLabel="Add artwork"
  />
);

export default AdminArtworkNewPage;
