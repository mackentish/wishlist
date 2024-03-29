-- DropForeignKey
ALTER TABLE "sharedList" DROP CONSTRAINT "sharedList_sharedUserId_fkey";

-- AlterTable
ALTER TABLE "sharedList" ADD COLUMN     "sharedEmail" VARCHAR(45),
ALTER COLUMN "sharedUserId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "sharedList" ADD CONSTRAINT "sharedList_sharedUserId_fkey" FOREIGN KEY ("sharedUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
