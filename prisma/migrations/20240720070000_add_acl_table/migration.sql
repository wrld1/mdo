-- CreateEnum
CREATE TYPE "AclPermission" AS ENUM ('READ', 'WRITE');

-- AlterTable
ALTER TABLE "company" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Acl" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "resource" TEXT NOT NULL,
    "permission" "AclPermission" NOT NULL,

    CONSTRAINT "Acl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Acl_userId_resource_key" ON "Acl"("userId", "resource");

-- AddForeignKey
ALTER TABLE "Acl" ADD CONSTRAINT "Acl_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
