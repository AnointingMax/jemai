import { createArtworkAction } from "@/app/admin/(dashboard)/artworks/actions";
import { ArtworkForm } from "@/components/admin/artwork-form";
import { listArtists } from "@/lib/admin/artists";
import { artworkMediums, artworkYears } from "@/lib/admin/artworks";

/** Add new Artwork — the create half of the shared artwork form. */
const AdminArtworkNewPage = async () => (
  <ArtworkForm
    artists={await listArtists()}
    mediums={artworkMediums}
    years={artworkYears}
    action={createArtworkAction}
    cancelHref="/admin/artworks"
    heading="Add new Artwork"
    submitLabel="Add artwork"
  />
);

export default AdminArtworkNewPage;
