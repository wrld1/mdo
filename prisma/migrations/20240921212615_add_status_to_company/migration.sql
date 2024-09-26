-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('PENDING', 'PROCESSED', 'BLOCKED');

-- AlterTable
ALTER TABLE "company" ADD COLUMN     "status" "CompanyStatus" NOT NULL DEFAULT 'PENDING';
