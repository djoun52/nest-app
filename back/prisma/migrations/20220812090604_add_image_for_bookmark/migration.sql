/*
  Warnings:

  - Added the required column `image` to the `bookmarks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookmarks" ADD COLUMN     "image" TEXT NOT NULL;