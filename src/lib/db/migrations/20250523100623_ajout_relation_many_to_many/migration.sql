-- CreateTable
CREATE TABLE "ArticleClassementCategory" (
    "articleId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ArticleClassementCategory_pkey" PRIMARY KEY ("articleId","categoryId")
);

-- AddForeignKey
ALTER TABLE "ArticleClassementCategory" ADD CONSTRAINT "ArticleClassementCategory_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "article_classement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleClassementCategory" ADD CONSTRAINT "ArticleClassementCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
