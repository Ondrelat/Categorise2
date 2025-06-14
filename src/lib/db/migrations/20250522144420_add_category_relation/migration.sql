-- AlterTable
ALTER TABLE "article_classement" ADD COLUMN     "categoryId" TEXT;

-- AlterTable
ALTER TABLE "article_references" ADD COLUMN     "categoryId" TEXT;

-- AddForeignKey
ALTER TABLE "article_references" ADD CONSTRAINT "article_references_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_classement" ADD CONSTRAINT "article_classement_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
