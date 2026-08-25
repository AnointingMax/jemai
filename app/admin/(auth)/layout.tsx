/**
 * The admin auth shell. Every frame in the set is the same 360px column on
 * white, starting 108px down — no sidebar, no header, nothing to navigate to
 * until there is a session.
 */
const AdminAuthLayout = ({ children }: LayoutProps<"/">) => (
  <div className="admin-surface flex min-h-svh flex-1 flex-col items-center bg-white px-4 pt-27 pb-16">
    {children}
  </div>
);

export default AdminAuthLayout;
