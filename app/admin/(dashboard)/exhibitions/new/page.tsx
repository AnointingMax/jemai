import { createExhibitionAction } from "@/app/admin/(dashboard)/exhibitions/actions";
import { ExhibitionForm } from "@/components/admin/exhibition-form";
import { listArtworks } from "@/lib/artworks";

/** Add new Exhibition — the create half of the shared exhibition form. */
const AdminExhibitionNewPage = async () => (
  <ExhibitionForm
    artworks={await listArtworks()}
    action={createExhibitionAction}
    cancelHref="/admin/exhibitions"
    heading="Add new Exhibition"
    submitLabel="Add exhibition"
  />
);

export default AdminExhibitionNewPage;
