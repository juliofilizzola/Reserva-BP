/*
  Warnings:

  - You are about to drop the `Scheduling` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Scheduling" DROP CONSTRAINT "Scheduling_brokerId_fkey";

-- DropForeignKey
ALTER TABLE "Scheduling" DROP CONSTRAINT "Scheduling_clientId_fkey";

-- DropTable
DROP TABLE "Scheduling";

-- CreateTable
CREATE TABLE "Reserve" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "appointment" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "description" TEXT,
    "clientId" TEXT NOT NULL,
    "brokerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Reserve_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reserve" ADD CONSTRAINT "Reserve_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserve" ADD CONSTRAINT "Reserve_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
