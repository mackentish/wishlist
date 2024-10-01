/*
  Warnings:

  - You are about to drop the `_ShareGroupTouser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ShareGroupTouser" DROP CONSTRAINT "_ShareGroupTouser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ShareGroupTouser" DROP CONSTRAINT "_ShareGroupTouser_B_fkey";

-- AlterTable
ALTER TABLE "List" RENAME CONSTRAINT "list_pkey" TO "List_pkey";

-- AlterTable
ALTER TABLE "ListItem" RENAME CONSTRAINT "listItem_pkey" TO "ListItem_pkey";

-- AlterTable
ALTER TABLE "SharedList" RENAME CONSTRAINT "sharedList_pkey" TO "SharedList_pkey";

-- AlterTable
ALTER TABLE "User" RENAME CONSTRAINT "user_pkey" TO "User_pkey";

-- DropTable
DROP TABLE "_ShareGroupTouser";

-- CreateTable
CREATE TABLE "_ShareGroupToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ShareGroupToUser_AB_unique" ON "_ShareGroupToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ShareGroupToUser_B_index" ON "_ShareGroupToUser"("B");

-- RenameForeignKey
ALTER TABLE "List" RENAME CONSTRAINT "list_userId_fkey" TO "List_userId_fkey";

-- RenameForeignKey
ALTER TABLE "ListItem" RENAME CONSTRAINT "listItem_boughtById_fkey" TO "ListItem_boughtById_fkey";

-- RenameForeignKey
ALTER TABLE "ListItem" RENAME CONSTRAINT "listItem_listId_fkey" TO "ListItem_listId_fkey";

-- RenameForeignKey
ALTER TABLE "SharedList" RENAME CONSTRAINT "sharedList_listId_fkey" TO "SharedList_listId_fkey";

-- RenameForeignKey
ALTER TABLE "SharedList" RENAME CONSTRAINT "sharedList_sharedUserId_fkey" TO "SharedList_sharedUserId_fkey";

-- AddForeignKey
ALTER TABLE "_ShareGroupToUser" ADD CONSTRAINT "_ShareGroupToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ShareGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShareGroupToUser" ADD CONSTRAINT "_ShareGroupToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "list_id_key" RENAME TO "List_id_key";

-- RenameIndex
ALTER INDEX "listItem_id_key" RENAME TO "ListItem_id_key";

-- RenameIndex
ALTER INDEX "sharedList_id_key" RENAME TO "SharedList_id_key";

-- RenameIndex
ALTER INDEX "user_email_key" RENAME TO "User_email_key";

-- RenameIndex
ALTER INDEX "user_id_key" RENAME TO "User_id_key";
