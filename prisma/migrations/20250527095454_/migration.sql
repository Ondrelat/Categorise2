-- CreateTable
CREATE TABLE "ArticleClassementUserData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "rating" INTEGER,
    "rank" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleClassementUserData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArticleClassementUserData_userId_articleId_key" ON "ArticleClassementUserData"("userId", "articleId");

-- AddForeignKey
ALTER TABLE "ArticleClassementUserData" ADD CONSTRAINT "ArticleClassementUserData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleClassementUserData" ADD CONSTRAINT "ArticleClassementUserData_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "article_classement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
