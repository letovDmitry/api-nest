import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OrderModule } from 'src/order/order.module';
import { OrderGateway } from 'src/order/order.gateway';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [forwardRef(() => OrderModule), OrderGateway],
  exports: [PaymentService],
})
export class PaymentModule {}
