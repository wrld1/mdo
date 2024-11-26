-- CreateEnum
CREATE TYPE "ObjectType" AS ENUM ('ApartmentBuilding');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "metadata" JSONB;

-- CreateTable
CREATE TABLE "Object" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "type" "ObjectType" NOT NULL,
    "companyId" TEXT,

    CONSTRAINT "Object_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObjectUser" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "objectId" TEXT NOT NULL,

    CONSTRAINT "ObjectUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "objectId" TEXT,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Object" ADD CONSTRAINT "Object_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjectUser" ADD CONSTRAINT "ObjectUser_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "Object"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjectUser" ADD CONSTRAINT "ObjectUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "Object"("id") ON DELETE SET NULL ON UPDATE CASCADE;
