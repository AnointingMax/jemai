import Link from "next/link";

import { ExhibitionTable, type ExhibitionRow } from "@/components/admin/exhibition-table";
import { Button } from "@/components/ui/button";
import {
  describeAdmission,
  exhibitionDates,
  listExhibitions,
} from "@/lib/admin/exhibitions";

/**
 * Exhibitions — the programme index. The store is read here and flattened to
 * the columns the table draws, so the media and long copy never cross to the
 * client.
 */
const AdminExhibitionsPage = () => {
  const rows: ExhibitionRow[] = listExhibitions().map((exhibition) => ({
    slug: exhibition.slug,
    name: exhibition.name,
    dates: exhibitionDates(exhibition),
    startDate: exhibition.startDate,
    venue: exhibition.venue,
    admission: describeAdmission(exhibition.admission),
    status: exhibition.status,
  }));

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-text-primary text-2xl font-semibold">Exhibitions</h1>
          <p className="text-text-secondary max-w-[70ch] text-sm">
            Create and edit upcoming exhibitions, then archive them when they move into
            JEMAI&rsquo;s past-exhibitions record.
          </p>
        </div>
        <Button asChild size="lg" className="h-11 shrink-0 px-5 text-sm">
          <Link href="/admin/exhibitions/new">Create exhibition</Link>
        </Button>
      </header>

      <ExhibitionTable rows={rows} />
    </div>
  );
};

export default AdminExhibitionsPage;
