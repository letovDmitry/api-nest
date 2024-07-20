import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    OrderModule,
    PaymentModule,
    ChatModule,
  ],
})
export class AppModule {}
