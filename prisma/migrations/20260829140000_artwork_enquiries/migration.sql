-- CreateTable
CREATE TABLE "artwork_enquiries" (
    "id" TEXT NOT NULL,
    "reference" SERIAL NOT NULL,
    "artworkId" TEXT,
    "artworkTitle" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'New',
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "artwork_enquiries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "artwork_enquiries_reference_key" ON "artwork_enquiries"("reference");

-- CreateIndex
CREATE INDEX "artwork_enquiries_artworkId_idx" ON "artwork_enquiries"("artworkId");

-- CreateIndex
CREATE INDEX "artwork_enquiries_status_idx" ON "artwork_enquiries"("status");

-- CreateIndex
CREATE INDEX "artwork_enquiries_receivedAt_idx" ON "artwork_enquiries"("receivedAt");

-- AddForeignKey
ALTER TABLE "artwork_enquiries" ADD CONSTRAINT "artwork_enquiries_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "artworks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
