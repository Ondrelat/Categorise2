/*
  Warnings:

  - You are about to drop the column `categoryId` on the `article_classement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "article_classement" DROP CONSTRAINT "article_classement_categoryId_fkey";

-- AlterTable
ALTER TABLE "article_classement" DROP COLUMN "categoryId";
