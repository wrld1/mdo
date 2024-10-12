/*
  Warnings:

  - Added the required column `code` to the `company` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Acl" DROP CONSTRAINT "Acl_userId_fkey";

-- AlterTable
ALTER TABLE "company" ADD COLUMN     "code" INTEGER NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Acl" ADD CONSTRAINT "Acl_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
