-- DropForeignKey
ALTER TABLE "UserList" DROP CONSTRAINT "UserList_categoryId_fkey";

-- AlterTable
ALTER TABLE "UserList" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserList" ADD CONSTRAINT "UserList_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
