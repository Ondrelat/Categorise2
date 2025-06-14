/*
  Warnings:

  - A unique constraint covering the columns `[listId,articleId]` on the table `ArticleClassementUserData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ArticleClassementUserData_listId_articleId_key" ON "ArticleClassementUserData"("listId", "articleId");
