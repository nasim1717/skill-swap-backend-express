/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `skills_offered` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `skills_wanted` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `skills_offered_user_id_key` ON `skills_offered`(`user_id`);

-- CreateIndex
CREATE UNIQUE INDEX `skills_wanted_user_id_key` ON `skills_wanted`(`user_id`);
