-- CreateEnum
CREATE TYPE "ArticleLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "level" "ArticleLevel",
ALTER COLUMN "status" DROP NOT NULL;
