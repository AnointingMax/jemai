import { forbidden } from "next/navigation";

import { hasPermission } from "@/lib/admin/auth/permissions";
import { requireAdminSession } from "@/lib/admin/auth/session";
import { taxonomyMeta } from "@/lib/admin/taxonomy";
import { TAXONOMY_KINDS } from "@/lib/taxonomy";

/**
 * Unlike the other sections this screen has no permission of its own: the two
 * vocabularies belong to the catalogues they describe, so holding either one is
 * enough to get in, and the page itself draws only the half a reader may edit.
 */
const TaxonomyLayout = async ({ children }: LayoutProps<"/admin/taxonomy">) => {
  const admin = await requireAdminSession();

  const allowed = TAXONOMY_KINDS.some((kind) =>
    hasPermission(admin.permissions, taxonomyMeta[kind].permission),
  );
  if (!allowed) forbidden();

  return children;
};

export default TaxonomyLayout;
