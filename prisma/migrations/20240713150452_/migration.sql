-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_boosterId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_userId_fkey";

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_boosterId_fkey" FOREIGN KEY ("boosterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
