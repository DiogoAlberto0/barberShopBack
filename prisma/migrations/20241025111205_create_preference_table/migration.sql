-- CreateTable
CREATE TABLE "Preferences" (
    "id" TEXT NOT NULL,
    "barberShopId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalPrice" REAL NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Preferences_barberShopId_fkey" FOREIGN KEY ("barberShopId") REFERENCES "BarberShop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Preferences_id_key" ON "Preferences"("id");
