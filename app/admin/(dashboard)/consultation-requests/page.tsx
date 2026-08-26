import { ConsultationTable } from "@/components/admin/consultation-table";
import { ExportCsvButton } from "@/components/admin/export-csv-button";
import {
  consultationWindow,
  listConsultations,
  requestedOn,
} from "@/lib/admin/consultations";

/**
 * Consultation requests — the studio's brief queue. Every request is read here
 * and handed to the table whole, because the side sheet draws the same record
 * and a second fetch per row would buy nothing at this size.
 */
const AdminConsultationRequestsPage = () => {
  const requests = listConsultations();

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
        {/* The export is the whole queue, not the current search — briefs are
            taken away to be read and costed, so it wants every one of them. */}
        <ExportCsvButton
          filename="jemai-consultation-requests.csv"
          headers={[
            "Request",
            "Name",
            "Email",
            "Phone",
            "Project type",
            "Timeline",
            "Budget",
            "Received",
            "Status",
            "Summary",
          ]}
          rows={requests.map((request) => [
            request.id,
            request.name,
            request.email,
            request.phone,
            request.projectType,
            consultationWindow(request),
            request.budget,
            requestedOn(request),
            request.status,
            request.summary,
          ])}
        />
      </header>

      <ConsultationTable requests={requests} />
    </div>
  );
};

export default AdminConsultationRequestsPage;
