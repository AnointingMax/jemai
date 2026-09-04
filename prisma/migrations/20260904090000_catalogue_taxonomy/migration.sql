-- CreateTable
CREATE TABLE "furniture_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "furniture_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artwork_mediums" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artwork_mediums_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "furniture_categories_name_key" ON "furniture_categories"("name");

-- CreateIndex
CREATE INDEX "furniture_categories_position_idx" ON "furniture_categories"("position");

-- CreateIndex
CREATE UNIQUE INDEX "artwork_mediums_name_key" ON "artwork_mediums"("name");

-- CreateIndex
CREATE INDEX "artwork_mediums_position_idx" ON "artwork_mediums"("position");

-- Backfill. The vocabulary used to be two hard-coded arrays in
-- lib/admin/furniture.ts and lib/admin/artworks.ts; those literals are the
-- seeded order below. Anything the catalogue is already filed under joins them
-- at the end, so a value typed into the database directly — or left behind by an
-- older list — survives the move rather than becoming unpickable.
INSERT INTO "furniture_categories" ("id", "name", "position", "updatedAt")
SELECT gen_random_uuid()::text, name, (ROW_NUMBER() OVER (ORDER BY ord, name))::int - 1, CURRENT_TIMESTAMP
FROM (
    SELECT name, MIN(ord) AS ord
    FROM (
        SELECT * FROM (VALUES
            ('Lounge', 0), ('Table', 1), ('Sofa', 2),
            ('Setee', 3), ('Bed', 4), ('Storage', 5)
        ) AS seeded (name, ord)
        UNION ALL
        SELECT DISTINCT "category", 1000 FROM "furniture" WHERE "category" <> ''
    ) AS candidates (name, ord)
    GROUP BY name
) AS terms;

INSERT INTO "artwork_mediums" ("id", "name", "position", "updatedAt")
SELECT gen_random_uuid()::text, name, (ROW_NUMBER() OVER (ORDER BY ord, name))::int - 1, CURRENT_TIMESTAMP
FROM (
    SELECT name, MIN(ord) AS ord
    FROM (
        SELECT * FROM (VALUES
            ('Textile installation', 0), ('Bronze sculpture', 1), ('Mixed media', 2),
            ('Oil Painting', 3), ('Textile', 4), ('Sculpture', 5), ('Photography', 6)
        ) AS seeded (name, ord)
        UNION ALL
        SELECT DISTINCT "medium", 1000 FROM "artworks" WHERE "medium" <> ''
    ) AS candidates (name, ord)
    GROUP BY name
) AS terms;
