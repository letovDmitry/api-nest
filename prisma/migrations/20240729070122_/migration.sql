/*
  Warnings:

  - Added the required column `isApproved` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isApproved" BOOLEAN NOT NULL;
