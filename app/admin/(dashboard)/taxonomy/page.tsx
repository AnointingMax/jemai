import { TaxonomyPanel } from "@/components/admin/taxonomy-panel";
import { hasPermission } from "@/lib/admin/auth/permissions";
import { requireAdminSession } from "@/lib/admin/auth/session";
import { listTaxonomy } from "@/lib/admin/taxonomy";

/**
 * Categories and mediums — the two vocabularies the catalogues are filed under.
 * They used to be arrays in the source, which meant a new collection was a
 * developer deployment; they are rows now, and this is where they are named,
 * ordered and retired.
 *
 * Each panel is gated on the catalogue it describes, so someone who only works
 * in the gallery sees the mediums and nothing else.
 */
const AdminTaxonomyPage = async () => {
  const admin = await requireAdminSession();
  const may = (permission: "furniture" | "artworks") =>
    hasPermission(admin.permissions, permission);

  const [categories, mediums] = await Promise.all([
    may("furniture") ? listTaxonomy("furniture-category") : null,
    may("artworks") ? listTaxonomy("artwork-medium") : null,
  ]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-text-primary text-2xl font-semibold">Categories &amp; mediums</h1>
        <p className="text-text-secondary max-w-[70ch] text-sm">
          The lists the catalogue forms pick from, and the order the storefront&rsquo;s
          Furniture and Art menus draw them in. Renaming one moves everything filed
          under it; a new one stays out of the storefront menus until something is.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        {categories ? (
          <TaxonomyPanel
            kind="furniture-category"
            title="Furniture categories"
            description="The collections a product can belong to. One per product, chosen on the product form."
            terms={categories}
            filed="products"
            placeholder="Dining"
            addLabel="New category"
          />
        ) : null}

        {mediums ? (
          <TaxonomyPanel
            kind="artwork-medium"
            title="Artwork mediums"
            description="What a work is made in. Optional on an artwork, and the Art menu is built from the ones in use."
            terms={mediums}
            filed="artworks"
            placeholder="Charcoal on paper"
            addLabel="New medium"
          />
        ) : null}
      </div>
    </div>
  );
};

export default AdminTaxonomyPage;
