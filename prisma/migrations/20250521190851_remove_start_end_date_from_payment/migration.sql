/*
  Warnings:

  - You are about to drop the column `endDate` on the `DwellingServicePayment` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `DwellingServicePayment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Dwelling_number_key";

-- AlterTable
ALTER TABLE "DwellingServicePayment" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "month" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "year" INTEGER NOT NULL DEFAULT 2023;
