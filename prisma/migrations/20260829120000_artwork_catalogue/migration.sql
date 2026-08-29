-- CreateTable
CREATE TABLE "artworks" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "medium" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "story" TEXT NOT NULL DEFAULT '',
    "curatorsPick" BOOLEAN NOT NULL DEFAULT false,
    "thumbnail" TEXT,
    "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artworks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "artworks_slug_key" ON "artworks"("slug");

-- CreateIndex
CREATE INDEX "artworks_medium_idx" ON "artworks"("medium");

-- CreateIndex
CREATE INDEX "artworks_curatorsPick_idx" ON "artworks"("curatorsPick");

-- CreateIndex
CREATE INDEX "artworks_updatedAt_idx" ON "artworks"("updatedAt");
