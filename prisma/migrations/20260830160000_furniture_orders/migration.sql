-- CreateTable
CREATE TABLE "furniture_orders" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "number" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT '',
    "postalCode" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "subtotal" INTEGER NOT NULL,
    "shipping" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL,
    "amountPaid" INTEGER,
    "payment" TEXT NOT NULL DEFAULT 'Pending payment',
    "status" TEXT NOT NULL DEFAULT 'New',
    "placedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),
    "processingAt" TIMESTAMP(3),
    "dispatchedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "furniture_orders_pkey" PRIMARY KEY ("id")
);

-- The console's order numbers are drawn as #JM-2038 upwards in the frames, and
-- the numbering is what the studio already quotes to buyers. Starting the
-- sequence there keeps the first real order continuous with them rather than
-- restarting the house at #JM-1.
ALTER SEQUENCE "furniture_orders_number_seq" RESTART WITH 2038;

-- CreateTable
CREATE TABLE "furniture_order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "furnitureId" TEXT,
    "variantId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "colour" TEXT NOT NULL DEFAULT '',
    "size" TEXT NOT NULL DEFAULT '',
    "unitPrice" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "furniture_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "furniture_orders_reference_key" ON "furniture_orders"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "furniture_orders_number_key" ON "furniture_orders"("number");

-- CreateIndex
CREATE INDEX "furniture_orders_payment_idx" ON "furniture_orders"("payment");

-- CreateIndex
CREATE INDEX "furniture_orders_status_idx" ON "furniture_orders"("status");

-- CreateIndex
CREATE INDEX "furniture_orders_placedAt_idx" ON "furniture_orders"("placedAt");

-- CreateIndex
CREATE INDEX "furniture_order_items_orderId_idx" ON "furniture_order_items"("orderId");

-- CreateIndex
CREATE INDEX "furniture_order_items_furnitureId_idx" ON "furniture_order_items"("furnitureId");

-- CreateIndex
CREATE INDEX "furniture_order_items_variantId_idx" ON "furniture_order_items"("variantId");

-- AddForeignKey
ALTER TABLE "furniture_order_items" ADD CONSTRAINT "furniture_order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "furniture_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "furniture_order_items" ADD CONSTRAINT "furniture_order_items_furnitureId_fkey" FOREIGN KEY ("furnitureId") REFERENCES "furniture"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "furniture_order_items" ADD CONSTRAINT "furniture_order_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "furniture_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
