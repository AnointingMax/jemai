-- A variant can carry its own price. Null keeps the product's own price, which
-- is what every existing row does.
-- AlterTable
ALTER TABLE "furniture_variants" ADD COLUMN "price" INTEGER;
