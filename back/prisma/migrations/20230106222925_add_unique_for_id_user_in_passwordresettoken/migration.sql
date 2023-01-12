/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `passwordResetToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "passwordResetToken_userId_key" ON "passwordResetToken"("userId");
