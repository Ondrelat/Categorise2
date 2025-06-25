/*
  Warnings:

  - Added the required column `userId` to the `tutorials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tutorials" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "tutorials" ADD CONSTRAINT "tutorials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
