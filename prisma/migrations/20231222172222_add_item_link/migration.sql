/*
  Warnings:

  - Added the required column `link` to the `listItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `listItem` ADD COLUMN `link` VARCHAR(255) NOT NULL;
