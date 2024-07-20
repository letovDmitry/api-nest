/*
  Warnings:

  - Added the required column `current` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_boosterId_fkey";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "current" TEXT NOT NULL,
ALTER COLUMN "boosterId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_boosterId_fkey" FOREIGN KEY ("boosterId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
