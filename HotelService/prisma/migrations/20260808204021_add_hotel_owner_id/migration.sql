/*
  Warnings:

  - Added the required column `ownerId` to the `Hotel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Hotel` ADD COLUMN `ownerId` INTEGER NOT NULL;
