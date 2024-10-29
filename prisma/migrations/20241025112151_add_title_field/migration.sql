/*
  Warnings:

  - Added the required column `title` to the `Preference` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Preference" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "barberShopId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "totalPrice" REAL NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Preference_barberShopId_fkey" FOREIGN KEY ("barberShopId") REFERENCES "BarberShop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Preference" ("barberShopId", "date", "id", "price", "quantity", "status", "totalPrice") SELECT "barberShopId", "date", "id", "price", "quantity", "status", "totalPrice" FROM "Preference";
DROP TABLE "Preference";
ALTER TABLE "new_Preference" RENAME TO "Preference";
CREATE UNIQUE INDEX "Preference_id_key" ON "Preference"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
