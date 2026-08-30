-- CreateTable
CREATE TABLE "exhibition_registrations" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "exhibitionId" TEXT,
    "exhibitionTitle" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "amountPaid" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'Confirmed',
    "paidAt" TIMESTAMP(3),
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exhibition_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exhibition_registrations_reference_key" ON "exhibition_registrations"("reference");

-- CreateIndex
CREATE INDEX "exhibition_registrations_exhibitionId_idx" ON "exhibition_registrations"("exhibitionId");

-- CreateIndex
CREATE INDEX "exhibition_registrations_status_idx" ON "exhibition_registrations"("status");

-- CreateIndex
CREATE INDEX "exhibition_registrations_registeredAt_idx" ON "exhibition_registrations"("registeredAt");

-- AddForeignKey
ALTER TABLE "exhibition_registrations" ADD CONSTRAINT "exhibition_registrations_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "exhibitions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
