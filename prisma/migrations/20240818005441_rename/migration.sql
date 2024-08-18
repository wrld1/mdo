/*
  Warnings:

  - You are about to drop the column `hashedRt` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Acl_userId_resource_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "hashedRt",
ADD COLUMN     "refreshToken" TEXT;
