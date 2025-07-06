-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "ArticleClassementCategory_categoryId_idx" ON "ArticleClassementCategory"("categoryId");

-- CreateIndex
CREATE INDEX "ArticleClassementUserList_userId_rank_createdAt_idx" ON "ArticleClassementUserList"("userId", "rank", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "ArticleClassementUserList_articleId_idx" ON "ArticleClassementUserList"("articleId");

-- CreateIndex
CREATE INDEX "ArticleClassementUserList_listId_idx" ON "ArticleClassementUserList"("listId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "UserList_userId_idx" ON "UserList"("userId");

-- CreateIndex
CREATE INDEX "article_classement_averageRatingIMDB_numVotesIMDB_idx" ON "article_classement"("averageRatingIMDB" DESC, "numVotesIMDB");

-- CreateIndex
CREATE INDEX "comments_discussionId_idx" ON "comments"("discussionId");

-- CreateIndex
CREATE INDEX "comments_userId_idx" ON "comments"("userId");

-- CreateIndex
CREATE INDEX "discussions_categoryId_idx" ON "discussions"("categoryId");

-- CreateIndex
CREATE INDEX "discussions_userId_idx" ON "discussions"("userId");

-- CreateIndex
CREATE INDEX "tutorials_categoryId_idx" ON "tutorials"("categoryId");

-- CreateIndex
CREATE INDEX "tutorials_userId_idx" ON "tutorials"("userId");
