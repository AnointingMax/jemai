import { requireAdminPermission } from "@/lib/admin/auth/session";

const OrdersLayout = async ({ children }: LayoutProps<"/admin/orders">) => {
  await requireAdminPermission("orders");
  return children;
};

export default OrdersLayout;
