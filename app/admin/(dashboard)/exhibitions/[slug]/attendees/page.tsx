import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { exportAttendeesAction } from "@/app/admin/(dashboard)/exhibitions/[slug]/attendees/actions";
import {
  AttendeeTable,
  ALL_PAYMENTS,
  type AttendeeRow,
} from "@/components/admin/attendee-table";
import { ExportCsvButton } from "@/components/admin/export-csv-button";
import { Button } from "@/components/ui/button";
import { formatUpdatedAt, naira } from "@/lib/admin/content";
import { exhibitionSpan, getExhibition } from "@/lib/admin/exhibitions";
import { isRegistrationStatus } from "@/lib/admin/registration-record";
import {
  listRegistrationsForExhibition,
  registrationSummary,
} from "@/lib/admin/registrations";

/** The counters above the table — one figure and its label apiece. */
const Tally = ({ label, value }: { label: string; value: string; }) => (
  <div className="border-border-default flex flex-col gap-1 rounded-xl border px-4 py-3">
    <span className="text-text-secondary text-xs">{label}</span>
    <span className="text-text-primary text-lg font-semibold">{value}</span>
  </div>
);

export const generateMetadata = async ({
  params,
}: PageProps<"/admin/exhibitions/[slug]/attendees">) => {
  const { slug } = await params;
  const exhibition = await getExhibition(slug);
  return { title: exhibition ? `${exhibition.name} — attendees` : "Attendees" };
};

/**
 * Who has registered for one exhibition, and the CSV of them for the door.
 * Reached from the exhibition's own detail screen and from the Attendees button
 * on the programme index.
 *
 * The payment filter is a query parameter rather than component state, so it
 * survives a reload, can be sent to somebody else as a link, and — because the
 * `where` runs in the database — decides what the export carries rather than
 * only what the table draws.
 */
const AdminExhibitionAttendeesPage = async ({
  params,
  searchParams,
}: PageProps<"/admin/exhibitions/[slug]/attendees">) => {
  const [{ slug }, query] = await Promise.all([params, searchParams]);

  const exhibition = await getExhibition(slug);
  if (!exhibition) notFound();

  /** A repeated parameter is a hand-made URL; the first one is the answer. */
  const one = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  // Anything that is not a status this console knows is treated as no filter at
  // all — a hand-edited query cannot put the page in a state its own control
  // could not reach.
  const asked = one(query.payment);
  const payment = asked && isRegistrationStatus(asked) ? asked : undefined;
  const search = one(query.q)?.trim() ?? "";

  const [registrations, summary] = await Promise.all([
    listRegistrationsForExhibition(exhibition.id, { status: payment, search }),
    registrationSummary(exhibition.id),
  ]);

  const rows: AttendeeRow[] = registrations.map((registration) => ({
    reference: registration.reference,
    name: registration.name,
    email: registration.email,
    phone: registration.phone,
    // What was actually settled, not what was quoted — an unpaid place shows
    // its state in the status column, not as an amount it never handed over.
    amount: registration.amountPaid ? naira(registration.amountPaid) : "Free",
    status: registration.status,
    registered: formatUpdatedAt(registration.registeredAt),
    registeredAt: registration.registeredAt,
  }));

  /** What the export is about to hand over, said in words beside the button. */
  const counted = `${rows.length} ${rows.length === 1 ? "attendee" : "attendees"}`;
  const exported =
    payment || search
      ? `${counted} ${rows.length === 1 ? "matches" : "match"} this view`
      : `${counted} in total`;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col items-start gap-2">
          <Button
            variant="link"
            size="sm"
            asChild
            className="text-text-secondary h-auto gap-1.5 p-0"
          >
            <Link href={`/admin/exhibitions/${exhibition.slug}`}>
              <ArrowLeft aria-hidden className="size-3.5" />
              {exhibition.name}
            </Link>
          </Button>
          <h1 className="text-text-primary text-2xl font-semibold">Attendees</h1>
          <p className="text-text-secondary max-w-[70ch] text-sm">
            {payment
              ? `Everyone ${payment.toLowerCase()} for ${exhibition.name}, ${exhibitionSpan(exhibition)}.`
              : `Everyone registered for ${exhibition.name}, ${exhibitionSpan(exhibition)}.`}
          </p>
        </div>
        {/* Built by the action from a fresh query under these filters, so the
            file is every matching registration rather than the rows on screen. */}
        <div className="flex flex-col items-start gap-1.5 sm:items-end">
          <ExportCsvButton
            onExport={exportAttendeesAction.bind(null, {
              slug: exhibition.slug,
              search,
              payment: payment ?? "",
            })}
          />
          <p className="text-text-secondary text-xs">{exported}</p>
        </div>
      </header>

      {/* The counters describe the whole exhibition, filter or no filter: they
          are what the filter is chosen from. */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tally label="Confirmed" value={String(summary.confirmed)} />
        <Tally label="Awaiting payment" value={String(summary.pending)} />
        <Tally label="Failed" value={String(summary.failed)} />
        <Tally label="Collected" value={naira(summary.collected)} />
      </div>

      <AttendeeTable
        rows={rows}
        payment={payment ?? ALL_PAYMENTS}
        search={search}
      />
    </div>
  );
};

export default AdminExhibitionAttendeesPage;
