import { ExportCsvButton } from "@/components/admin/export-csv-button";
import { NewsletterTable, type SubscriberRow } from "@/components/admin/newsletter-table";
import { listSubscribers, subscribedAt } from "@/lib/admin/newsletter";

/**
 * Newsletter subscribers — a read-only list. Nothing here is editable: the
 * console's job is to let someone find an address and hand the whole list to
 * whatever sends the mail.
 */
const AdminNewsletterPage = () => {
  const subscribers = listSubscribers();
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
        {/* The export is the whole list, not the current search — it feeds a
            mailing tool, which wants everyone who opted in. */}
        <ExportCsvButton
          filename="jemai-newsletter-subscribers.csv"
          headers={["Email address", "Name", "Source", "Subscribed"]}
          rows={subscribers.map((subscriber) => [
            subscriber.email,
            subscriber.name,
            subscriber.source,
            subscriber.subscribedAt,
          ])}
        />
      </header>

      <NewsletterTable rows={rows} />
    </div>
  );
};

export default AdminNewsletterPage;
