import { createExhibitionAction } from "@/app/admin/(dashboard)/exhibitions/actions";
import { ExhibitionForm } from "@/components/admin/exhibition-form";
import { exhibitionStatuses } from "@/lib/admin/exhibitions";
import { artworks } from "@/lib/artworks";

/** Add new Exhibition — the create half of the shared exhibition form. */
const AdminExhibitionNewPage = () => (
  <ExhibitionForm
    artworks={artworks}
    statuses={exhibitionStatuses}
    action={createExhibitionAction}
    cancelHref="/admin/exhibitions"
    heading="Add new Exhibition"
    submitLabel="Add exhibition"
  />
);

export default AdminExhibitionNewPage;
