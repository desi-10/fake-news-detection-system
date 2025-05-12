/*
  Warnings:

  - You are about to drop the column `contentText` on the `Feedback` table. All the data in the column will be lost.
  - Added the required column `content` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Made the column `rating` on table `Feedback` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "contentText",
ADD COLUMN     "content" TEXT NOT NULL,
ALTER COLUMN "rating" SET NOT NULL;
