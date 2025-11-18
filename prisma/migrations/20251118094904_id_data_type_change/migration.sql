/*
  Warnings:

  - The primary key for the `chat_requests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `chat_requests` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `sender_id` on the `chat_requests` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `receiver_id` on the `chat_requests` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `chat_threads` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `chat_threads` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `participant_a` on the `chat_threads` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `participant_b` on the `chat_threads` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `messages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `messages` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `sender_id` on the `messages` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `receiver_id` on the `messages` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `thread_id` on the `messages` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `reviews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `reviews` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `reviewer_id` on the `reviews` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `reviewed_user_id` on the `reviews` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `skills_offered` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `skills_offered` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `user_id` on the `skills_offered` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `skills_wanted` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `skills_wanted` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `user_id` on the `skills_wanted` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `chat_requests` DROP FOREIGN KEY `chat_requests_receiver_id_fkey`;

-- DropForeignKey
ALTER TABLE `chat_requests` DROP FOREIGN KEY `chat_requests_sender_id_fkey`;

-- DropForeignKey
ALTER TABLE `chat_threads` DROP FOREIGN KEY `chat_threads_participant_a_fkey`;

-- DropForeignKey
ALTER TABLE `chat_threads` DROP FOREIGN KEY `chat_threads_participant_b_fkey`;

-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `messages_receiver_id_fkey`;

-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `messages_sender_id_fkey`;

-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `messages_thread_id_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_reviewed_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_reviewer_id_fkey`;

-- DropForeignKey
ALTER TABLE `skills_offered` DROP FOREIGN KEY `skills_offered_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `skills_wanted` DROP FOREIGN KEY `skills_wanted_user_id_fkey`;

-- DropIndex
DROP INDEX `chat_threads_participant_b_fkey` ON `chat_threads`;

-- AlterTable
ALTER TABLE `chat_requests` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `sender_id` INTEGER NOT NULL,
    MODIFY `receiver_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `chat_threads` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `participant_a` INTEGER NOT NULL,
    MODIFY `participant_b` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `messages` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `sender_id` INTEGER NOT NULL,
    MODIFY `receiver_id` INTEGER NOT NULL,
    MODIFY `thread_id` INTEGER NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `reviews` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `reviewer_id` INTEGER NOT NULL,
    MODIFY `reviewed_user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `skills_offered` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `skills_wanted` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `skills_offered` ADD CONSTRAINT `skills_offered_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skills_wanted` ADD CONSTRAINT `skills_wanted_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_receiver_id_fkey` FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_thread_id_fkey` FOREIGN KEY (`thread_id`) REFERENCES `chat_threads`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_requests` ADD CONSTRAINT `chat_requests_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_requests` ADD CONSTRAINT `chat_requests_receiver_id_fkey` FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_threads` ADD CONSTRAINT `chat_threads_participant_a_fkey` FOREIGN KEY (`participant_a`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_threads` ADD CONSTRAINT `chat_threads_participant_b_fkey` FOREIGN KEY (`participant_b`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_reviewer_id_fkey` FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_reviewed_user_id_fkey` FOREIGN KEY (`reviewed_user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
