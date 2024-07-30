import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderGateway } from './order.gateway';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderGateway],
  imports: [forwardRef(() => PaymentModule)],
  exports: [OrderService]
})
export class OrderModule {}
