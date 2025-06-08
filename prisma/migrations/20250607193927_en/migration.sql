/*
  Warnings:

  - Added the required column `userId` to the `ArticleClassementUserData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ArticleClassementUserData" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ArticleClassementUserData" ADD CONSTRAINT "ArticleClassementUserData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
