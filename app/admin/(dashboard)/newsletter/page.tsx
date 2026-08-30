import { exportSubscribersAction } from "@/app/admin/(dashboard)/newsletter/actions";
import { ExportCsvButton } from "@/components/admin/export-csv-button";
import { NewsletterTable, type SubscriberRow } from "@/components/admin/newsletter-table";
import { listSubscribers, subscribedAt } from "@/lib/admin/newsletter";
import { param } from "@/lib/admin/table-query";

/**
 * Newsletter subscribers — a read-only list. Nothing here is editable: the
 * console's job is to let someone find an address and hand the whole list to
 * whatever sends the mail.
 */
const AdminNewsletterPage = async ({ searchParams }: PageProps<"/admin/newsletter">) => {
  // The search lives in the URL, so the view survives a reload and can be sent
  // as a link; the narrowing runs in the query rather than over rows already
  // sent — which is also what the export below carries.
  const search = param(await searchParams, "q") ?? "";
  const subscribers = await listSubscribers(search);
  const rows: SubscriberRow[] = subscribers.map((subscriber) => ({
    email: subscriber.email,
    name: subscriber.name,
    source: subscriber.source,
    date: subscribedAt(subscriber),
    subscribedAt: subscriber.subscribedAt,
  }));

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-text-primary text-2xl font-semibold">Newsletter subscribers</h1>
          <p className="text-text-secondary max-w-[70ch] text-sm">
            View the subscriber list and export it for use in JEMAI&rsquo;s external marketing
            tools.
          </p>
        </div>
        {/* Built by the action from a fresh query under this search, so the file
            is every matching subscriber rather than the rows on screen. */}
        <ExportCsvButton onExport={exportSubscribersAction.bind(null, { search })} />
      </header>

      <NewsletterTable rows={rows} search={search} />
    </div>
  );
};

export default AdminNewsletterPage;
