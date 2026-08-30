import { exportConsultationsAction } from "@/app/admin/(dashboard)/consultation-requests/actions";
import {
  ALL_CONSULTATION_STATUSES,
  ConsultationTable,
} from "@/components/admin/consultation-table";
import { ExportCsvButton } from "@/components/admin/export-csv-button";
import { consultationStatuses } from "@/lib/admin/consultation-record";
import { listConsultations } from "@/lib/admin/consultations";
import { param, paramOneOf } from "@/lib/admin/table-query";

/**
 * Consultation requests — the studio's brief queue. Every request is read here
 * and handed to the table whole, because the side sheet draws the same record
 * and a second fetch per row would buy nothing at this size.
 */
const AdminConsultationRequestsPage = async ({
  searchParams,
}: PageProps<"/admin/consultation-requests">) => {
  // The search box and the status filter live in the URL, so the view survives
  // a reload and can be sent as a link; the narrowing runs on the server rather
  // than over records already sent — which is also what the export carries.
  const query = await searchParams;
  const search = param(query, "q") ?? "";
  const status = paramOneOf(query, "status", consultationStatuses);

  const requests = await listConsultations({ search, status });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-text-primary text-2xl font-semibold">Consultation requests</h1>
          <p className="text-text-secondary max-w-[70ch] text-sm">
            Design consultation requests from the enquiry form. Open one to read the brief and move
            it through triage.
          </p>
        </div>
        {/* Built by the action from a fresh read under these filters, so the
            file is every matching brief rather than the rows on screen. */}
        <ExportCsvButton
          onExport={exportConsultationsAction.bind(null, { search, status: status ?? "" })}
        />
      </header>

      <ConsultationTable
        requests={requests}
        search={search}
        status={status ?? ALL_CONSULTATION_STATUSES}
      />
    </div>
  );
};

export default AdminConsultationRequestsPage;
