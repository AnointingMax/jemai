import { EnquiryTable } from "@/components/admin/enquiry-table";
import { ExportCsvButton } from "@/components/admin/export-csv-button";
import { listEnquiries } from "@/lib/admin/enquiries";
import { describeArtwork, enquiredOn } from "@/lib/admin/enquiry-record";

/**
 * Artwork enquiries — the follow-up queue. Every enquiry is read here and handed
 * to the table whole, because the side sheet draws the same record and a second
 * fetch per row would buy nothing at this size.
 */
const AdminArtworkEnquiriesPage = async () => {
  const enquiries = await listEnquiries();

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
        {/* The export is the whole queue, not the current search — it is taken
            away to be worked through, so it wants every open enquiry. */}
        <ExportCsvButton
          filename="jemai-artwork-enquiries.csv"
          headers={["Enquiry", "Name", "Email", "Phone", "Artwork", "Received", "Status", "Message"]}
          rows={enquiries.map((enquiry) => [
            enquiry.reference,
            enquiry.name,
            enquiry.email,
            enquiry.phone,
            describeArtwork(enquiry),
            enquiredOn(enquiry),
            enquiry.status,
            enquiry.message,
          ])}
        />
      </header>

      <EnquiryTable enquiries={enquiries} />
    </div>
  );
};

export default AdminArtworkEnquiriesPage;
