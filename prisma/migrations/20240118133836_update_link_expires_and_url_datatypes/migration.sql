/*
  Warnings:

  - The `linkExpires` column on the `list` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "list" DROP COLUMN "linkExpires",
ADD COLUMN     "linkExpires" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "listItem" ALTER COLUMN "link" SET DATA TYPE TEXT;
