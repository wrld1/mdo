/*
  Warnings:

  - The primary key for the `order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `orderStatus` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `order` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `order` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('RECEIVED', 'IN_PROGRESS', 'FINISHED', 'BLOCKED', 'INVALID');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('ELECTRICITY', 'WATER', 'GAS', 'OTHER');

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_userId_fkey";

-- AlterTable
ALTER TABLE "order" DROP CONSTRAINT "order_pkey",
ADD COLUMN     "orderStatus" "OrderStatus" NOT NULL,
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "type" "OrderType" NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET NOT NULL,
ADD CONSTRAINT "order_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "order_id_seq";

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
