-- AlterTable
ALTER TABLE "user" ADD COLUMN     "authType" TEXT DEFAULT 'EMAIL',
ADD COLUMN     "phoneVerificationCode" TEXT,
ADD COLUMN     "phoneVerificationExpires" TIMESTAMP(3);
