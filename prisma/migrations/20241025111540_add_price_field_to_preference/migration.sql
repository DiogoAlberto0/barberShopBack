/*
  Warnings:

  - Added the required column `price` to the `Preferences` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Preferences" (
    "id" TEXT NOT NULL,
    "barberShopId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "totalPrice" REAL NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Preferences_barberShopId_fkey" FOREIGN KEY ("barberShopId") REFERENCES "BarberShop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Preferences" ("barberShopId", "date", "id", "quantity", "status", "totalPrice") SELECT "barberShopId", "date", "id", "quantity", "status", "totalPrice" FROM "Preferences";
DROP TABLE "Preferences";
ALTER TABLE "new_Preferences" RENAME TO "Preferences";
CREATE UNIQUE INDEX "Preferences_id_key" ON "Preferences"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
