/*
  Warnings:

  - You are about to alter the column `weekDay` on the `Operation` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Operation" (
    "id" TEXT NOT NULL,
    "weekDay" INTEGER NOT NULL,
    "openHour" INTEGER NOT NULL,
    "openMinute" INTEGER NOT NULL,
    "closeHour" INTEGER NOT NULL,
    "closeMinute" INTEGER NOT NULL,
    "barberShopId" TEXT,
    "userId" TEXT,
    CONSTRAINT "Operation_barberShopId_fkey" FOREIGN KEY ("barberShopId") REFERENCES "BarberShop" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Operation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Operation" ("barberShopId", "closeHour", "closeMinute", "id", "openHour", "openMinute", "userId", "weekDay") SELECT "barberShopId", "closeHour", "closeMinute", "id", "openHour", "openMinute", "userId", "weekDay" FROM "Operation";
DROP TABLE "Operation";
ALTER TABLE "new_Operation" RENAME TO "Operation";
CREATE UNIQUE INDEX "Operation_id_key" ON "Operation"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
