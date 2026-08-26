import type { EnquiryStatus } from "@/lib/admin/enquiries";
import type { ExhibitionStatus } from "@/lib/admin/exhibitions";
import type { FulfilmentStatus } from "@/lib/admin/orders";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type AdminStatus = FulfilmentStatus | ExhibitionStatus | EnquiryStatus;

/**
 * Dot colour per state — the badge chrome itself is the same hairline pill.
 * The fulfilment four are sampled off the orders frame; none of them has a
 * published variable, so they sit here as literal hex.
 */
const dot: Record<AdminStatus, string> = {
  New: "bg-text-primary",
  Processing: "bg-[#ff8d28]",
  "Ready for dispatch": "bg-[#ffcc00]",
  Delivered: "bg-[#34c759]",
  Upcoming: "bg-[#2f8f4e]",
  Archived: "bg-text-primary",
  // The request queues have no frames of their own, so they borrow the
  // fulfilment palette: in-progress amber, settled green.
  "In conversation": "bg-[#ff8d28]",
  Closed: "bg-[#34c759]",
};

/** The status pill the order and exhibition tables share: a 6px dot, the label, a hairline border. */
export const StatusBadge = ({ status }: { status: AdminStatus }) => (
  <Badge
    variant="outline"
    className="border-border-default text-text-primary h-7 gap-1.5 rounded-md px-2 text-xs font-medium"
  >
    <span aria-hidden className={cn("size-1.5 rounded-full", dot[status])} />
    {status}
  </Badge>
);
