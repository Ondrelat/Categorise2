/*
  Warnings:

  - You are about to drop the column `articleId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `articleId` on the `revisions` table. All the data in the column will be lost.
  - You are about to drop the `article_references` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `article_tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `articles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `content_blocks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `content_references` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `redirects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `references` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sections` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `table_of_contents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tutorialId` to the `revisions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "article_references" DROP CONSTRAINT "article_references_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "article_references" DROP CONSTRAINT "article_references_sourceArticleId_fkey";

-- DropForeignKey
ALTER TABLE "article_references" DROP CONSTRAINT "article_references_targetArticleId_fkey";

-- DropForeignKey
ALTER TABLE "article_tags" DROP CONSTRAINT "article_tags_articleId_fkey";

-- DropForeignKey
ALTER TABLE "article_tags" DROP CONSTRAINT "article_tags_tagId_fkey";

-- DropForeignKey
ALTER TABLE "articles" DROP CONSTRAINT "articles_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_articleId_fkey";

-- DropForeignKey
ALTER TABLE "content_blocks" DROP CONSTRAINT "content_blocks_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "content_references" DROP CONSTRAINT "content_references_blockId_fkey";

-- DropForeignKey
ALTER TABLE "content_references" DROP CONSTRAINT "content_references_referenceId_fkey";

-- DropForeignKey
ALTER TABLE "redirects" DROP CONSTRAINT "redirects_targetArticleId_fkey";

-- DropForeignKey
ALTER TABLE "references" DROP CONSTRAINT "references_articleId_fkey";

-- DropForeignKey
ALTER TABLE "revisions" DROP CONSTRAINT "revisions_articleId_fkey";

-- DropForeignKey
ALTER TABLE "sections" DROP CONSTRAINT "sections_articleId_fkey";

-- DropForeignKey
ALTER TABLE "sections" DROP CONSTRAINT "sections_parentSectionId_fkey";

-- DropForeignKey
ALTER TABLE "table_of_contents" DROP CONSTRAINT "table_of_contents_articleId_fkey";

-- DropForeignKey
ALTER TABLE "table_of_contents" DROP CONSTRAINT "table_of_contents_sectionId_fkey";

-- DropIndex
DROP INDEX "comments_articleId_idx";

-- DropIndex
DROP INDEX "comments_userId_idx";

-- DropIndex
DROP INDEX "revisions_articleId_idx";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "articleId",
ADD COLUMN     "discussionId" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "revisions" DROP COLUMN "articleId",
ADD COLUMN     "tutorialId" TEXT NOT NULL;

-- DropTable
DROP TABLE "article_references";

-- DropTable
DROP TABLE "article_tags";

-- DropTable
DROP TABLE "articles";

-- DropTable
DROP TABLE "content_blocks";

-- DropTable
DROP TABLE "content_references";

-- DropTable
DROP TABLE "redirects";

-- DropTable
DROP TABLE "references";

-- DropTable
DROP TABLE "sections";

-- DropTable
DROP TABLE "table_of_contents";

-- DropTable
DROP TABLE "tags";

-- DropEnum
DROP TYPE "ArticleReferenceType";

-- CreateTable
CREATE TABLE "tutorials" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "slug" TEXT,
    "imageUrl" TEXT,
    "type" TEXT NOT NULL,
    "status" "ArticleStatus" DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "level" "ArticleLevel",

    CONSTRAINT "tutorials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discussions" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,

    CONSTRAINT "discussions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TutorialPrerequisites" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TutorialPrerequisites_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TutorialNext" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TutorialNext_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "tutorials_slug_key" ON "tutorials"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tutorials_categoryId_level_key" ON "tutorials"("categoryId", "level");

-- CreateIndex
CREATE INDEX "_TutorialPrerequisites_B_index" ON "_TutorialPrerequisites"("B");

-- CreateIndex
CREATE INDEX "_TutorialNext_B_index" ON "_TutorialNext"("B");

-- CreateIndex
CREATE INDEX "revisions_tutorialId_idx" ON "revisions"("tutorialId");

-- AddForeignKey
ALTER TABLE "tutorials" ADD CONSTRAINT "tutorials_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussions" ADD CONSTRAINT "discussions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussions" ADD CONSTRAINT "discussions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "discussions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revisions" ADD CONSTRAINT "revisions_tutorialId_fkey" FOREIGN KEY ("tutorialId") REFERENCES "tutorials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TutorialPrerequisites" ADD CONSTRAINT "_TutorialPrerequisites_A_fkey" FOREIGN KEY ("A") REFERENCES "tutorials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TutorialPrerequisites" ADD CONSTRAINT "_TutorialPrerequisites_B_fkey" FOREIGN KEY ("B") REFERENCES "tutorials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TutorialNext" ADD CONSTRAINT "_TutorialNext_A_fkey" FOREIGN KEY ("A") REFERENCES "tutorials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TutorialNext" ADD CONSTRAINT "_TutorialNext_B_fkey" FOREIGN KEY ("B") REFERENCES "tutorials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
