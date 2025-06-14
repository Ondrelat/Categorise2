/*
  Warnings:

  - A unique constraint covering the columns `[categoryId,userId]` on the table `UserList` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ArticleClassementUserData" DROP CONSTRAINT "ArticleClassementUserData_listId_fkey";

-- AlterTable
ALTER TABLE "ArticleClassementUserData" ALTER COLUMN "listId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserList_categoryId_userId_key" ON "UserList"("categoryId", "userId");

-- AddForeignKey
ALTER TABLE "ArticleClassementUserData" ADD CONSTRAINT "ArticleClassementUserData_listId_fkey" FOREIGN KEY ("listId") REFERENCES "UserList"("id") ON DELETE SET NULL ON UPDATE CASCADE;
