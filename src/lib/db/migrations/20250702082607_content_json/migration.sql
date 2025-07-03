-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "contentJson" JSONB,
ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "discussions" ADD COLUMN     "contentJson" JSONB,
ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tutorials" ADD COLUMN     "contentJson" JSONB,
ALTER COLUMN "content" DROP NOT NULL;
