/*
  Warnings:

  - You are about to drop the `Preferences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Preferences";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Preference" (
    "id" TEXT NOT NULL,
    "barberShopId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "totalPrice" REAL NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Preference_barberShopId_fkey" FOREIGN KEY ("barberShopId") REFERENCES "BarberShop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Preference_id_key" ON "Preference"("id");
