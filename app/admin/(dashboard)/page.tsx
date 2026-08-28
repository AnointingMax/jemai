import Link from "next/link";

import { OrderTable } from "@/components/admin/order-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { needsAttention, overviewStats, recentOrders } from "@/lib/admin/dashboard";

/**
 * Overview — the console's landing screen: four counters, the recent-order table
 * and a queue rail. The frame runs the table and the rail side by side from
 * `lg:` up and stacks them below it.
 */
const AdminOverviewPage = async () => {
  const stats = await overviewStats();

  return (
  <div className="flex flex-col gap-6">
    <header className="flex flex-col gap-1">
      <h1 className="text-text-primary text-2xl font-semibold">Welcome back, Admin</h1>
      <p className="text-text-secondary text-sm">
        The current catalogue, enquiries, exhibitions and furniture orders at a glance.
      </p>
    </header>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Link
          key={stat.label}
          href={stat.href}
          className="focus-visible:ring-ring/50 rounded-xl outline-none focus-visible:ring-3"
        >
          <Card className="ring-border-default h-full gap-2 py-5 transition-colors hover:bg-admin-muted">
            <CardContent className="flex flex-col gap-3">
              <span className="text-text-secondary text-eyebrow-lg uppercase">{stat.label}</span>
              <span className="text-text-primary text-2xl font-medium">{stat.value}</span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>

    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
      <Card className="ring-border-default">
        <CardHeader>
          <CardTitle className="text-text-primary font-sans text-xl font-semibold">
            Recent furniture orders
          </CardTitle>
        </CardHeader>
        <CardContent className="border-border-default overflow-hidden rounded-lg border">
          <OrderTable orders={recentOrders()} />
        </CardContent>
      </Card>

      <Card className="ring-border-default">
        <CardHeader>
          <CardTitle className="text-text-primary font-sans text-xl font-semibold">Needs attention</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          {needsAttention.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="focus-visible:ring-ring/50 -mx-2 flex items-center gap-3 rounded-lg px-2 py-3 outline-none hover:bg-admin-muted focus-visible:ring-3"
            >
              <span className="bg-surface-subtle text-text-primary flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                {item.count}
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-text-primary block text-sm font-medium">{item.title}</span>
                <span className="text-text-secondary block text-xs">{item.detail}</span>
              </span>
              <span aria-hidden className="size-2 shrink-0 rounded-full bg-[#2f8f4e]" />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
  );
};

export default AdminOverviewPage;
