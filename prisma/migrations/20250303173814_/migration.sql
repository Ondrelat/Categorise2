/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `articles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ArticleReferenceType" AS ENUM ('PREREQUISITE', 'COURSE_PART');

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "slug" TEXT,
ADD COLUMN     "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE "article_references" (
    "id" TEXT NOT NULL,
    "sourceArticleId" TEXT NOT NULL,
    "targetArticleId" TEXT NOT NULL,
    "referenceType" "ArticleReferenceType" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_references_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "article_references_sourceArticleId_idx" ON "article_references"("sourceArticleId");

-- CreateIndex
CREATE INDEX "article_references_targetArticleId_idx" ON "article_references"("targetArticleId");

-- CreateIndex
CREATE UNIQUE INDEX "article_references_sourceArticleId_targetArticleId_referenc_key" ON "article_references"("sourceArticleId", "targetArticleId", "referenceType");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- AddForeignKey
ALTER TABLE "article_references" ADD CONSTRAINT "article_references_sourceArticleId_fkey" FOREIGN KEY ("sourceArticleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_references" ADD CONSTRAINT "article_references_targetArticleId_fkey" FOREIGN KEY ("targetArticleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
