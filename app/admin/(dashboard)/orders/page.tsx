import { exportOrdersAction } from "@/app/admin/(dashboard)/orders/actions";
import { ExportCsvButton } from "@/components/admin/export-csv-button";
import {
  ALL_FULFILLMENT_STATUSES,
  OrderFilters,
  OrderTable,
} from "@/components/admin/order-table";
import { fulfillmentStatuses } from "@/lib/admin/order-record";
import { listOrders } from "@/lib/admin/orders";
import { param, paramOneOf } from "@/lib/admin/table-query";

const AdminOrdersPage = async ({ searchParams }: PageProps<"/admin/orders">) => {
  const query = await searchParams;
  const search = param(query, "q") ?? "";
  const status = paramOneOf(query, "status", fulfillmentStatuses);

  const orders = await listOrders({ search, status });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-text-primary text-2xl font-semibold">Furniture orders</h1>
          <p className="text-text-secondary max-w-[70ch] text-sm">
            Every checkout Paystack settled. Open one to read the order and move it through
            fulfillment.
          </p>
        </div>
        <ExportCsvButton
          onExport={exportOrdersAction.bind(null, { search, status: status ?? "" })}
        />
      </header>

      <OrderFilters search={search} status={status ?? ALL_FULFILLMENT_STATUSES} />

      <div className="border-border-default overflow-hidden rounded-xl border">
        <OrderTable orders={orders} pageSize={10} />
      </div>
    </div>
  );
};

export default AdminOrdersPage;
