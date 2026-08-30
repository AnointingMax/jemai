import { exportEnquiriesAction } from "@/app/admin/(dashboard)/artwork-enquiries/actions";
import { ALL_ENQUIRY_STATUSES, EnquiryTable } from "@/components/admin/enquiry-table";
import { ExportCsvButton } from "@/components/admin/export-csv-button";
import { listEnquiries } from "@/lib/admin/enquiries";
import { enquiryStatuses } from "@/lib/admin/enquiry-record";
import { param, paramOneOf } from "@/lib/admin/table-query";

/**
 * Artwork enquiries — the follow-up queue. Every enquiry is read here and handed
 * to the table whole, because the side sheet draws the same record and a second
 * fetch per row would buy nothing at this size.
 */
const AdminArtworkEnquiriesPage = async ({
  searchParams,
}: PageProps<"/admin/artwork-enquiries">) => {
  // The search box and the status filter live in the URL, so the view survives
  // a reload and can be sent as a link; the narrowing runs in the query rather
  // than over rows already sent — which is also what the export carries.
  const query = await searchParams;
  const search = param(query, "q") ?? "";
  const status = paramOneOf(query, "status", enquiryStatuses);

  const enquiries = await listEnquiries({ search, status });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-text-primary text-2xl font-semibold">Artwork enquiries</h1>
          <p className="text-text-secondary max-w-[70ch] text-sm">
            Enquiries raised from an artwork&rsquo;s detail page. Open one to read the message and
            move it through follow-up.
          </p>
        </div>
        {/* Built by the action from a fresh query under these filters, so the
            file is every matching enquiry rather than the rows on screen. */}
        <ExportCsvButton
          onExport={exportEnquiriesAction.bind(null, { search, status: status ?? "" })}
        />
      </header>

      <EnquiryTable
        enquiries={enquiries}
        search={search}
        status={status ?? ALL_ENQUIRY_STATUSES}
      />
    </div>
  );
};

export default AdminArtworkEnquiriesPage;
