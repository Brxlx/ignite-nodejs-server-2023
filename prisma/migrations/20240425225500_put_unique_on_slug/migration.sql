/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `questions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "questions_author_id_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "questions_slug_key" ON "questions"("slug");
