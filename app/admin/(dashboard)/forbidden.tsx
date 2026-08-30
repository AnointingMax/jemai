import Link from "next/link";

import { Button } from "@/components/ui/button";

const AdminForbidden = () => (
  <div className="flex flex-col items-start gap-4 py-16">
    <div className="flex flex-col gap-1">
      <h1 className="text-text-primary text-2xl font-semibold">No access to this section</h1>
      <p className="text-text-secondary max-w-[60ch] text-sm">
        Your account does not carry the permission this section is behind. Ask another
        administrator to grant it if you need to work in here.
      </p>
    </div>
    <Button asChild variant="outline">
      <Link href="/admin">Back to overview</Link>
    </Button>
  </div>
);

export default AdminForbidden;
