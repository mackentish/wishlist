-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(45) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "list" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "description" VARCHAR(100),
    "linkExpires" TIME,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listItem" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "note" VARCHAR(100),
    "link" VARCHAR(255) NOT NULL,
    "isBought" BOOLEAN NOT NULL DEFAULT false,
    "listId" INTEGER NOT NULL,

    CONSTRAINT "listItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sharedList" (
    "id" SERIAL NOT NULL,
    "listId" INTEGER NOT NULL,
    "sharedUserId" INTEGER NOT NULL,

    CONSTRAINT "sharedList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "list_id_key" ON "list"("id");

-- CreateIndex
CREATE UNIQUE INDEX "listItem_id_key" ON "listItem"("id");

-- CreateIndex
CREATE UNIQUE INDEX "sharedList_id_key" ON "sharedList"("id");

-- AddForeignKey
ALTER TABLE "list" ADD CONSTRAINT "list_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listItem" ADD CONSTRAINT "listItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sharedList" ADD CONSTRAINT "sharedList_listId_fkey" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sharedList" ADD CONSTRAINT "sharedList_sharedUserId_fkey" FOREIGN KEY ("sharedUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
