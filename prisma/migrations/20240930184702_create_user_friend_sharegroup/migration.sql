-- CreateTable
CREATE TABLE "ShareGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "ShareGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ShareGroupTouser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ShareGroupTouser_AB_unique" ON "_ShareGroupTouser"("A", "B");

-- CreateIndex
CREATE INDEX "_ShareGroupTouser_B_index" ON "_ShareGroupTouser"("B");

-- AddForeignKey
ALTER TABLE "ShareGroup" ADD CONSTRAINT "ShareGroup_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShareGroupTouser" ADD CONSTRAINT "_ShareGroupTouser_A_fkey" FOREIGN KEY ("A") REFERENCES "ShareGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShareGroupTouser" ADD CONSTRAINT "_ShareGroupTouser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
