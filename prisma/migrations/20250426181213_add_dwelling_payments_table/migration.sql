/*
  Warnings:

  - You are about to drop the column `amount` on the `DwellingService` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DwellingServicePaymentStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE');

-- AlterEnum
ALTER TYPE "OrderType" ADD VALUE 'ORGANIZATION';

-- AlterTable
ALTER TABLE "DwellingService" DROP COLUMN "amount";

-- CreateTable
CREATE TABLE "DwellingServicePayment" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "counter" DECIMAL(65,30) NOT NULL,
    "status" "DwellingServicePaymentStatus" NOT NULL,
    "paymentDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dwellingServiceId" INTEGER NOT NULL,

    CONSTRAINT "DwellingServicePayment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DwellingServicePayment" ADD CONSTRAINT "DwellingServicePayment_dwellingServiceId_fkey" FOREIGN KEY ("dwellingServiceId") REFERENCES "DwellingService"("id") ON DELETE CASCADE ON UPDATE CASCADE;
