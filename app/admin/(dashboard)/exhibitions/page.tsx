import Link from "next/link";

import {
  ALL_STATUSES,
  ExhibitionTable,
  type ExhibitionRow,
} from "@/components/admin/exhibition-table";
import { Button } from "@/components/ui/button";
import {
  describeAdmission,
  exhibitionDates,
  exhibitionStatuses,
  listExhibitions,
} from "@/lib/admin/exhibitions";
import { param, paramOneOf } from "@/lib/admin/table-query";

/**
 * Exhibitions — the programme index. The store is read here and flattened to
 * the columns the table draws, so the media and long copy never cross to the
 * client.
 */
const AdminExhibitionsPage = async ({ searchParams }: PageProps<"/admin/exhibitions">) => {
  // The search box and the status filter live in the URL, so the view survives
  // a reload and can be sent as a link; the narrowing runs in the query rather
  // than over rows already sent.
  const query = await searchParams;
  const search = param(query, "q") ?? "";
  const status = paramOneOf(query, "status", exhibitionStatuses);

  const exhibitions = await listExhibitions({ search, status });
  const rows: ExhibitionRow[] = exhibitions.map((exhibition) => ({
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
            Create and edit the programme. A show&rsquo;s status follows its run:
            it moves into JEMAI&rsquo;s past-exhibitions record the day after it ends,
            with nothing to archive by hand.
          </p>
        </div>
        <Button asChild size="lg" className="h-11 shrink-0 px-5 text-sm">
          <Link href="/admin/exhibitions/new">Create exhibition</Link>
        </Button>
      </header>

      <ExhibitionTable
        rows={rows}
        statuses={exhibitionStatuses}
        search={search}
        status={status ?? ALL_STATUSES}
      />
    </div>
  );
};

export default AdminExhibitionsPage;
