/*
  Warnings:

  - Added the required column `categoryId` to the `UserList` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ArticleClassementUserData" DROP CONSTRAINT "ArticleClassementUserData_categoryId_fkey";

-- AlterTable
ALTER TABLE "UserList" ADD COLUMN     "categoryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserList" ADD CONSTRAINT "UserList_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
