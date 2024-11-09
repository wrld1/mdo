-- CreateEnum
CREATE TYPE "FraudStatus" AS ENUM ('CLEAR', 'SUSPENDED', 'BLOCKED');

-- AlterEnum
ALTER TYPE "CompanyStatus" ADD VALUE 'INACTIVE';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "fraudStatus" "FraudStatus" NOT NULL DEFAULT 'CLEAR';
