/*
  Warnings:

  - You are about to drop the `ObjectUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "DwellingServiceStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'INACTIVE');

-- DropForeignKey
ALTER TABLE "ObjectUser" DROP CONSTRAINT "ObjectUser_objectId_fkey";

-- DropForeignKey
ALTER TABLE "ObjectUser" DROP CONSTRAINT "ObjectUser_userId_fkey";

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "dwellingId" INTEGER;

-- DropTable
DROP TABLE "ObjectUser";

-- CreateTable
CREATE TABLE "Dwelling" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "floor" INTEGER,
    "entrance" INTEGER,
    "objectId" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Dwelling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DwellingService" (
    "id" SERIAL NOT NULL,
    "status" "DwellingServiceStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "dwellingId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,

    CONSTRAINT "DwellingService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dwelling_number_key" ON "Dwelling"("number");

-- AddForeignKey
ALTER TABLE "Dwelling" ADD CONSTRAINT "Dwelling_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "Object"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dwelling" ADD CONSTRAINT "Dwelling_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DwellingService" ADD CONSTRAINT "DwellingService_dwellingId_fkey" FOREIGN KEY ("dwellingId") REFERENCES "Dwelling"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DwellingService" ADD CONSTRAINT "DwellingService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_dwellingId_fkey" FOREIGN KEY ("dwellingId") REFERENCES "Dwelling"("id") ON DELETE SET NULL ON UPDATE CASCADE;
