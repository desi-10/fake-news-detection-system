/*
  Warnings:

  - Changed the type of `factCheckingContent` on the `Article` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "factCheckingContent",
ADD COLUMN     "factCheckingContent" JSONB NOT NULL;
