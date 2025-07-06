-- DropIndex
DROP INDEX "Categories_isActive_idx";

-- DropIndex
DROP INDEX "Categories_name_idx";

-- DropIndex
DROP INDEX "Categories_parentId_idx";

-- DropIndex
DROP INDEX "Categories_slug_idx";

-- CreateIndex
CREATE INDEX "idx_categories_recursive_cte" ON "Categories"("parentId", "isActive", "id");

-- CreateIndex
CREATE INDEX "idx_categories_root_active" ON "Categories"("parentId", "isActive");

-- CreateIndex
CREATE INDEX "idx_categories_name_active" ON "Categories"("name", "isActive");

-- CreateIndex
CREATE INDEX "idx_categories_slug_active" ON "Categories"("slug", "isActive");

-- CreateIndex
CREATE INDEX "idx_categories_stats" ON "Categories"("id", "isActive");

-- CreateIndex
CREATE INDEX "idx_categories_updated_active" ON "Categories"("updatedAt", "isActive");

-- CreateIndex
CREATE INDEX "idx_categories_covering" ON "Categories"("isActive", "parentId", "name", "id");
