import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OrderModule } from 'src/order/order.module';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [forwardRef(() => OrderModule)],
  exports: [PaymentService],
})
export class PaymentModule {}
