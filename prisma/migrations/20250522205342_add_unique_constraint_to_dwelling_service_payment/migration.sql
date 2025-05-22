/*
  Warnings:

  - A unique constraint covering the columns `[dwellingServiceId,month,year]` on the table `DwellingServicePayment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DwellingServicePayment_dwellingServiceId_month_year_key" ON "DwellingServicePayment"("dwellingServiceId", "month", "year");
