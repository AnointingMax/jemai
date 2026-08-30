-- An exhibition's status is derived from its run rather than stored: a show is
-- archived once its end date has passed, and nothing has to be updated by hand
-- for that to become true. The column goes, and the index that served it is
-- replaced by one on the date the derivation actually reads.

-- DropIndex
DROP INDEX "exhibitions_status_idx";

-- AlterTable
ALTER TABLE "exhibitions" DROP COLUMN "status";

-- CreateIndex
CREATE INDEX "exhibitions_endDate_idx" ON "exhibitions"("endDate");
