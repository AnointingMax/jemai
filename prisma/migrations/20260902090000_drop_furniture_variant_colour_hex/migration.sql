-- Swatch colours are resolved from the colour name in code, so the column was
-- never written to.
-- AlterTable
ALTER TABLE "furniture_variants" DROP COLUMN "colourHex";
