-- CreateTable
CREATE TABLE "consultation_requests" (
    "id" TEXT NOT NULL,
    "reference" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "projectType" TEXT NOT NULL,
    "startDate" DATE,
    "endDate" DATE,
    "budget" TEXT NOT NULL DEFAULT '',
    "summary" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'New',
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consultation_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "consultation_requests_reference_key" ON "consultation_requests"("reference");

-- CreateIndex
CREATE INDEX "consultation_requests_status_idx" ON "consultation_requests"("status");

-- CreateIndex
CREATE INDEX "consultation_requests_receivedAt_idx" ON "consultation_requests"("receivedAt");
