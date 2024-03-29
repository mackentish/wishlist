/*
  Warnings:

  - You are about to drop the column `isBought` on the `listItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "listItem" DROP COLUMN "isBought",
ADD COLUMN     "boughtById" INTEGER DEFAULT 0;

-- AddForeignKey
ALTER TABLE "listItem" ADD CONSTRAINT "listItem_boughtById_fkey" FOREIGN KEY ("boughtById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
