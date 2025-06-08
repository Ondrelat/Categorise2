/*
  Warnings:

  - You are about to drop the column `userId` on the `ArticleClassementUserData` table. All the data in the column will be lost.
  - Added the required column `listId` to the `ArticleClassementUserData` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ArticleClassementUserData" DROP CONSTRAINT "ArticleClassementUserData_userId_fkey";

-- DropIndex
DROP INDEX "ArticleClassementUserData_userId_articleId_key";

-- AlterTable
ALTER TABLE "ArticleClassementUserData" DROP COLUMN "userId",
ADD COLUMN     "listId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "UserList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserList_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArticleClassementUserData" ADD CONSTRAINT "ArticleClassementUserData_listId_fkey" FOREIGN KEY ("listId") REFERENCES "UserList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserList" ADD CONSTRAINT "UserList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
