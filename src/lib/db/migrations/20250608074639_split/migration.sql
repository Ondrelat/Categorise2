/*
  Warnings:

  - You are about to drop the column `categoryId` on the `ArticleClassementUserData` table. All the data in the column will be lost.
  - You are about to drop the column `listId` on the `ArticleClassementUserData` table. All the data in the column will be lost.
  - You are about to drop the column `onList` on the `ArticleClassementUserData` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `ArticleClassementUserData` table. All the data in the column will be lost.
  - You are about to drop the column `rankTierList` on the `ArticleClassementUserData` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[articleId,userId]` on the table `ArticleClassementUserData` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ArticleClassementUserData" DROP CONSTRAINT "ArticleClassementUserData_listId_fkey";

-- DropIndex
DROP INDEX "ArticleClassementUserData_listId_articleId_key";

-- AlterTable
ALTER TABLE "ArticleClassementUserData" DROP COLUMN "categoryId",
DROP COLUMN "listId",
DROP COLUMN "onList",
DROP COLUMN "rank",
DROP COLUMN "rankTierList";

-- CreateTable
CREATE TABLE "ArticleClassementUserList" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "categoryId" TEXT,
    "listId" TEXT,
    "userId" TEXT NOT NULL,
    "rank" INTEGER,
    "rankTierList" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleClassementUserList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArticleClassementUserList_listId_articleId_key" ON "ArticleClassementUserList"("listId", "articleId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleClassementUserData_articleId_userId_key" ON "ArticleClassementUserData"("articleId", "userId");

-- AddForeignKey
ALTER TABLE "ArticleClassementUserList" ADD CONSTRAINT "ArticleClassementUserList_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "article_classement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleClassementUserList" ADD CONSTRAINT "ArticleClassementUserList_listId_fkey" FOREIGN KEY ("listId") REFERENCES "UserList"("id") ON DELETE SET NULL ON UPDATE CASCADE;
