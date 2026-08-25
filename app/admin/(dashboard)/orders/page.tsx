import { OrderTable } from "@/components/admin/order-table";
import { listOrders } from "@/lib/admin/orders";

/**
 * Furniture orders — the fulfilment index. Every order is read here and handed
 * to the table whole, because the side sheet draws the same record and a second
 * fetch per row would buy nothing at this size.
 */
const AdminOrdersPage = () => (
  <div className="flex flex-col gap-6">
    <header className="flex flex-col gap-1">
      <h1 className="text-text-primary text-2xl font-semibold">Furniture orders</h1>
      <p className="text-text-secondary text-sm">
        Only Paystack-verified purchases appear here. Manage each order through fulfilment.
      </p>
    </header>

    <div className="border-border-default overflow-hidden rounded-xl border">
      <OrderTable orders={listOrders()} pageSize={10} />
    </div>
  </div>
);

export default AdminOrdersPage;
