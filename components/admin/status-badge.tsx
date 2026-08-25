import type { FulfilmentStatus } from "@/lib/admin/dashboard";
import type { ExhibitionStatus } from "@/lib/admin/exhibitions";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type AdminStatus = FulfilmentStatus | ExhibitionStatus;

/** Dot colour per state — the badge chrome itself is the same hairline pill. */
const dot: Record<AdminStatus, string> = {
  New: "bg-text-primary",
  Processing: "bg-[#e07a2f]",
  Shipped: "bg-[#2f6fe0]",
  Delivered: "bg-[#2f8f4e]",
  Upcoming: "bg-[#2f8f4e]",
  Archived: "bg-text-primary",
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
