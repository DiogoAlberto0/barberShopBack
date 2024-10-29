/*
  Warnings:

  - You are about to drop the column `barberShopId` on the `Address` table. All the data in the column will be lost.
  - Added the required column `addressId` to the `BarberShop` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Address" (
    "id" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "complement" TEXT
);
INSERT INTO "new_Address" ("city", "complement", "country", "id", "neighborhood", "number", "state", "street", "zipCode") SELECT "city", "complement", "country", "id", "neighborhood", "number", "state", "street", "zipCode" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";
CREATE UNIQUE INDEX "Address_id_key" ON "Address"("id");
CREATE TABLE "new_BarberShop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "barberLimit" INTEGER NOT NULL DEFAULT 10,
    "contractExpiration" DATETIME NOT NULL,
    "addressId" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    CONSTRAINT "BarberShop_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BarberShop_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BarberShop" ("barberLimit", "contractExpiration", "id", "managerId", "name", "phone") SELECT "barberLimit", "contractExpiration", "id", "managerId", "name", "phone" FROM "BarberShop";
DROP TABLE "BarberShop";
ALTER TABLE "new_BarberShop" RENAME TO "BarberShop";
CREATE UNIQUE INDEX "BarberShop_name_key" ON "BarberShop"("name");
CREATE UNIQUE INDEX "BarberShop_phone_key" ON "BarberShop"("phone");
CREATE UNIQUE INDEX "BarberShop_addressId_key" ON "BarberShop"("addressId");
CREATE UNIQUE INDEX "BarberShop_managerId_key" ON "BarberShop"("managerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
