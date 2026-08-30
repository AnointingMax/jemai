import { formatDateRange, formatDateTimeShort, formatUpdatedAt } from "@/lib/admin/content";
import { matchesSearch } from "@/lib/admin/table-query";

/**
 * Where a request sits with the studio. A brief is triaged, then a first
 * conversation is booked, and it ends either as work or not — so this queue
 * carries a `Scheduled` stage the enquiry queue has no use for.
 */
export const consultationStatuses = ["New", "Reviewing", "Scheduled", "Closed"] as const;

export type ConsultationStatus = (typeof consultationStatuses)[number];

/**
 * One design consultation request, holding exactly what the storefront's
 * inquiry form asks for — the two dates and the budget are the optional half,
 * so all three can arrive blank and the console has to draw that.
 */
export type AdminConsultation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  /** One of `projectTypes` on the storefront form; free text as far as this store cares. */
  projectType: string;
  /** `yyyy-mm-dd`, or blank — the form does not require either end. */
  startDate: string;
  endDate: string;
  /** The picked range as its label, or blank if the reader skipped it. */
  budget: string;
  summary: string;
  /** ISO. The table prints `requestedAt`, sorting compares this. */
  receivedAt: string;
  status: ConsultationStatus;
};

/**
 * Fixtures until the inquiry form has an endpoint. The three `New` rows are the
 * three the overview's "Review project briefs" tile counts, so the two screens
 * agree; the project types and budget bands are the form's own lists.
 */
const store: AdminConsultation[] = [
  {
    id: "#CR-0318",
    name: "Chidinma Okonkwo",
    email: "chidinma.okonkwo@example.com",
    phone: "+234 802 771 6034",
    projectType: "Full Renovation",
    startDate: "2026-10-05",
    endDate: "2027-03-19",
    budget: "₦50,000,000 – ₦150,000,000",
    summary:
      "A four-bedroom family house in Ikoyi that has not been touched since 2009. We want to open up the ground floor, rework the kitchen entirely and rethink how the living spaces connect to the garden.\n\nWe are not in a hurry, but we would like to start before the rains.",
    receivedAt: "2026-08-18T08:47:00.000Z",
    status: "New",
  },
  {
    id: "#CR-0317",
    name: "Emeka Nnadi",
    email: "emeka.nnadi@example.com",
    phone: "+234 706 440 2218",
    projectType: "Interior Decor",
    startDate: "2026-09-14",
    endDate: "2026-11-27",
    budget: "₦15,000,000 – ₦50,000,000",
    summary:
      "Newly built apartment in Victoria Island, completely empty. Looking for a single coherent scheme rather than furniture bought piece by piece.",
    receivedAt: "2026-08-17T15:12:00.000Z",
    status: "New",
  },
  {
    id: "#CR-0316",
    name: "Halima Sanusi",
    email: "halima.sanusi@example.com",
    phone: "+234 803 226 9915",
    projectType: "Art Curation",
    startDate: "",
    endDate: "",
    budget: "",
    summary:
      "We are opening a members' club in Lekki early next year and want a curated collection across the bar, the dining room and two private rooms. Still working out the budget, which is partly why I am writing.",
    receivedAt: "2026-08-16T11:30:00.000Z",
    status: "New",
  },
  {
    id: "#CR-0315",
    name: "Ronke Adebayo",
    email: "ronke.adebayo@example.com",
    phone: "+234 805 118 7742",
    projectType: "Furniture Selection",
    startDate: "2026-09-01",
    endDate: "2026-10-15",
    budget: "₦5,000,000 – ₦15,000,000",
    summary:
      "Two reception rooms and a study. The architecture is finished and we only need help choosing and placing the furniture.",
    receivedAt: "2026-08-15T09:05:00.000Z",
    status: "Reviewing",
  },
  {
    id: "#CR-0314",
    name: "Ibrahim Yusuf",
    email: "ibrahim.yusuf@example.com",
    phone: "+234 809 553 1180",
    projectType: "Architecture",
    startDate: "2027-01-11",
    endDate: "2028-06-30",
    budget: "Above ₦150,000,000",
    summary:
      "A new-build family house on a corner plot in Abuja. We have the survey and planning consent; what we do not have is a design we believe in.",
    receivedAt: "2026-08-14T17:22:00.000Z",
    status: "Reviewing",
  },
  {
    id: "#CR-0313",
    name: "Grace Oyelaran",
    email: "grace.oyelaran@example.com",
    phone: "+234 701 993 4408",
    projectType: "Interior Decor",
    startDate: "2026-09-07",
    endDate: "2026-12-18",
    budget: "₦15,000,000 – ₦50,000,000",
    summary: "Our office reception and boardroom, which currently look like nobody chose them.",
    receivedAt: "2026-08-13T13:48:00.000Z",
    status: "Scheduled",
  },
  {
    id: "#CR-0312",
    name: "Daniel Okonjo",
    email: "daniel.okonjo@example.com",
    phone: "+234 802 664 3371",
    projectType: "Full Renovation",
    startDate: "2026-10-19",
    endDate: "2027-02-05",
    budget: "₦50,000,000 – ₦150,000,000",
    summary:
      "A townhouse in Yaba we have just bought. Structurally sound, everything else needs to go. We would like to keep the original staircase if that is at all workable.",
    receivedAt: "2026-08-12T10:16:00.000Z",
    status: "Scheduled",
  },
  {
    id: "#CR-0311",
    name: "Simi Fashola",
    email: "simi.fashola@example.com",
    phone: "+234 806 337 5529",
    projectType: "Other",
    startDate: "",
    endDate: "",
    budget: "Under ₦5,000,000",
    summary:
      "A single room — a home studio. Small project, but I would rather it were done properly than cheaply.",
    receivedAt: "2026-08-11T16:41:00.000Z",
    status: "Closed",
  },
  {
    id: "#CR-0310",
    name: "Uche Mbanefo",
    email: "uche.mbanefo@example.com",
    phone: "+234 703 552 8807",
    projectType: "Art Curation",
    startDate: "2026-09-21",
    endDate: "2026-11-06",
    budget: "₦5,000,000 – ₦15,000,000",
    summary: "Six to eight works for a private residence, chosen to sit together.",
    receivedAt: "2026-08-10T12:09:00.000Z",
    status: "Closed",
  },
  {
    id: "#CR-0309",
    name: "Peju Ogundipe",
    email: "peju.ogundipe@example.com",
    phone: "+234 808 114 6693",
    projectType: "Furniture Selection",
    startDate: "2026-08-24",
    endDate: "2026-09-30",
    budget: "",
    summary:
      "Dining room only. We have the table already and need everything that goes around it.",
    receivedAt: "2026-08-09T07:53:00.000Z",
    status: "Closed",
  },
  {
    id: "#CR-0308",
    name: "Bola Ransome",
    email: "bola.ransome@example.com",
    phone: "+234 807 229 4416",
    projectType: "Architecture",
    startDate: "2027-02-01",
    endDate: "2027-12-15",
    budget: "Above ₦150,000,000",
    summary:
      "A guest house on family land outside Ibadan. Early days — we are talking to three practices before deciding.",
    receivedAt: "2026-08-08T14:37:00.000Z",
    status: "Closed",
  },
  {
    id: "#CR-0307",
    name: "Ifeanyi Duru",
    email: "ifeanyi.duru@example.com",
    phone: "+234 809 880 2245",
    projectType: "Interior Decor",
    startDate: "",
    endDate: "",
    budget: "₦5,000,000 – ₦15,000,000",
    summary: "Two bedrooms and a hallway. No fixed dates; whenever you have capacity.",
    receivedAt: "2026-08-07T09:24:00.000Z",
    status: "Closed",
  },
];

/** Newest first, the way the index draws them before the reader sorts. */
export type ConsultationQuery = { search?: string; status?: ConsultationStatus; };

/**
 * Newest first, narrowed by the queue's search box and status filter. This
 * store is still fixtures rather than rows, so the narrowing is a pass over the
 * array — but it happens here, on the server, so the page and its export see
 * the same records the reader does.
 */
export const listConsultations = ({ search, status }: ConsultationQuery = {}) =>
  [...store]
    .filter(
      (request) =>
        (!status || request.status === status) &&
        matchesSearch([request.name, request.email, request.projectType], search),
    )
    .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));

/** "18 Aug · 08:47" — the index's Received column. */
export const requestedAt = (request: Pick<AdminConsultation, "receivedAt">) =>
  formatDateTimeShort(request.receivedAt);

/** "18 Aug 2026 8:47 am" — the long stamp the sheet prints. */
export const requestedOn = (request: Pick<AdminConsultation, "receivedAt">) =>
  formatUpdatedAt(request.receivedAt);

/**
 * "5 Oct – 19 Mar" for a full range, one end alone if only one was given, and a
 * dash when the reader skipped both — the two date fields are optional on the
 * storefront form, so all three cases really arrive. `formatDateRange` already
 * settles each of them.
 */
export const consultationWindow = (request: Pick<AdminConsultation, "startDate" | "endDate">) =>
  formatDateRange(request.startDate, request.endDate);
