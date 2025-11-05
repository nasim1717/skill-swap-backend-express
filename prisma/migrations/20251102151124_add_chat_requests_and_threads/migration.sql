-- AlterTable
ALTER TABLE `messages` ADD COLUMN `seen` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `thread_id` BIGINT NULL;

-- CreateTable
CREATE TABLE `chat_requests` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `sender_id` BIGINT NOT NULL,
    `receiver_id` BIGINT NOT NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'DECLINED') NOT NULL DEFAULT 'PENDING',
    `message` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    INDEX `chat_requests_sender_id_idx`(`sender_id`),
    INDEX `chat_requests_receiver_id_idx`(`receiver_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_threads` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `participant_a` BIGINT NOT NULL,
    `participant_b` BIGINT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `chat_threads_participant_a_participant_b_key`(`participant_a`, `participant_b`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `messages_thread_id_idx` ON `messages`(`thread_id`);

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
