/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `list` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `listItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `list_id_key` ON `list`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `listItem_id_key` ON `listItem`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `user_id_key` ON `user`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `user_email_key` ON `user`(`email`);