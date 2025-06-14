-- AlterTable
ALTER TABLE "ArticleClassementUserData" ADD COLUMN     "categoryId" TEXT;

-- AddForeignKey
ALTER TABLE "ArticleClassementUserData" ADD CONSTRAINT "ArticleClassementUserData_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
