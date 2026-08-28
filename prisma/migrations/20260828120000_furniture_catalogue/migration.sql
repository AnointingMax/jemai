-- CreateTable
CREATE TABLE "furniture" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timeline" TEXT NOT NULL,
    "customization" TEXT NOT NULL,
    "thumbnail" TEXT,
    "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "furniture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "furniture_variants" (
    "id" TEXT NOT NULL,
    "furnitureId" TEXT NOT NULL,
    "size" TEXT NOT NULL DEFAULT '',
    "colour" TEXT NOT NULL,
    "colourHex" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "furniture_variants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "furniture_slug_key" ON "furniture"("slug");

-- CreateIndex
CREATE INDEX "furniture_category_idx" ON "furniture"("category");

-- CreateIndex
CREATE INDEX "furniture_updatedAt_idx" ON "furniture"("updatedAt");

-- CreateIndex
CREATE INDEX "furniture_variants_furnitureId_idx" ON "furniture_variants"("furnitureId");

-- AddForeignKey
ALTER TABLE "furniture_variants" ADD CONSTRAINT "furniture_variants_furnitureId_fkey" FOREIGN KEY ("furnitureId") REFERENCES "furniture"("id") ON DELETE CASCADE ON UPDATE CASCADE;
