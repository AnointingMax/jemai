import { AdminAccountsTable, type AdminAccountRow } from "@/components/admin/admin-accounts-table";
import { InviteAdminDialog } from "@/components/admin/invite-admin-dialog";
import { addedOn, listAdmins } from "@/lib/admin/admins";
import { ADMIN_PERMISSIONS } from "@/lib/admin/auth/permissions";
import { requireAdminPermission } from "@/lib/admin/auth/session";
import { param } from "@/lib/admin/table-query";

const AdminAccountsPage = async ({ searchParams }: PageProps<"/admin/admins">) => {
  const session = await requireAdminPermission("admins");

  const query = await searchParams;
  const search = param(query, "q") ?? "";
  const invite = param(query, "invite") === "1";
  const admins = await listAdmins(search);
  const rows: AdminAccountRow[] = admins.map((admin) => ({
    ...admin,
    added: addedOn(admin),
  }));

  const grantable = ADMIN_PERMISSIONS.filter((permission) =>
    session.permissions.includes(permission),
  );

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-text-primary text-2xl font-semibold">Administrators</h1>
          <p className="text-text-secondary max-w-[70ch] text-sm">
            Everyone with a way into this console. An account is opened here with the
            sections it may work in, and suspended here when it should no longer sign
            in.
          </p>
        </div>
        <InviteAdminDialog
          key={invite ? "invite-open" : "invite-closed"}
          grantable={grantable}
          initiallyOpen={invite}
        />
      </header>

      <AdminAccountsTable rows={rows} search={search} currentAdminId={session.id} />
    </div>
  );
};

export default AdminAccountsPage;
