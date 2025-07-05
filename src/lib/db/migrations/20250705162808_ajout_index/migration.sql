-- CreateIndex
CREATE INDEX "Categories_parentId_idx" ON "Categories"("parentId");

-- CreateIndex
CREATE INDEX "Categories_name_idx" ON "Categories"("name");

-- CreateIndex
CREATE INDEX "Categories_isActive_idx" ON "Categories"("isActive");

-- CreateIndex
CREATE INDEX "Categories_slug_idx" ON "Categories"("slug");
