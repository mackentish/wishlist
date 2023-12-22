/*
  Warnings:

  - You are about to drop the column `description` on the `listItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `listItem` DROP COLUMN `description`,
    ADD COLUMN `note` VARCHAR(100) NULL;
