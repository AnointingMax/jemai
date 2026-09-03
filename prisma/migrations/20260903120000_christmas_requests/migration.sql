-- CreateTable
CREATE TABLE "christmas_requests" (
    "id" TEXT NOT NULL,
    "reference" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "areas" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'New',
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "christmas_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "christmas_requests_reference_key" ON "christmas_requests"("reference");

-- CreateIndex
CREATE INDEX "christmas_requests_year_idx" ON "christmas_requests"("year");

-- CreateIndex
CREATE INDEX "christmas_requests_status_idx" ON "christmas_requests"("status");

-- CreateIndex
CREATE INDEX "christmas_requests_receivedAt_idx" ON "christmas_requests"("receivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "christmas_requests_year_email_key" ON "christmas_requests"("year", "email");
