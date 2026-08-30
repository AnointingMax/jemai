-- CreateTable
CREATE TABLE "exhibitions" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "venue" TEXT NOT NULL DEFAULT '',
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "price" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Upcoming',
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "artistBio" TEXT NOT NULL,
    "thumbnail" TEXT,
    "artistProfile" TEXT,
    "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exhibitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exhibition_artworks" (
    "exhibitionId" TEXT NOT NULL,
    "artworkId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "exhibition_artworks_pkey" PRIMARY KEY ("exhibitionId","artworkId")
);

-- CreateIndex
CREATE UNIQUE INDEX "exhibitions_slug_key" ON "exhibitions"("slug");

-- CreateIndex
CREATE INDEX "exhibitions_status_idx" ON "exhibitions"("status");

-- CreateIndex
CREATE INDEX "exhibitions_startDate_idx" ON "exhibitions"("startDate");

-- CreateIndex
CREATE INDEX "exhibitions_updatedAt_idx" ON "exhibitions"("updatedAt");

-- CreateIndex
CREATE INDEX "exhibition_artworks_artworkId_idx" ON "exhibition_artworks"("artworkId");

-- AddForeignKey
ALTER TABLE "exhibition_artworks" ADD CONSTRAINT "exhibition_artworks_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "exhibitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exhibition_artworks" ADD CONSTRAINT "exhibition_artworks_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "artworks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
