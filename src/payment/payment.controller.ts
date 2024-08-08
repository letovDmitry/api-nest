import { Controller, Post, UsePipes, ValidationPipe, Body, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { PaymentDto, PaymentStatusDto } from './dto';
import { PaymentService } from './payment.service';

// @UseGuards(JwtGuard)
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  createPayment(@Body() dto: PaymentDto) {
    return this.paymentService.payment(dto)
  }

  @Post('status')
  getPaymentStatus(@Body() dto) {
    return this.paymentService.getPaymentStatus(dto)
  }

  @Post('status/enot')
  getPaymentStatusEnot(@Body() dto) {
    return this.paymentService.getPaymentStatusEnot(dto)
  }

  @Post('status/selfwork')
  getPaymentStatusSelfwork(@Body() dto) {
    return this.paymentService.getPaymentStatusSelfwork(dto)
  }
}

// import { Body, Controller, Post, UseGuards } from "@nestjs/common";
// import { PaymentService } from "./payment.service";
// import { JwtGuard } from "src/auth/guard";
// import { GetUser } from "src/auth/decorator";

// @Controller("payment")
// export class PaymentController {
//   constructor(private readonly paymentService: PaymentService) {}

//   @UseGuards(JwtGuard)
//   @Post("enot")
//   createPaymentEnot(@Body() dto: any, @GetUser("email") userEmail: string) {
//     return this.paymentService.createPaymentEnot(
//       dto.price,
//       dto.system,
//       dto.type,
//       dto.aim,
//       userEmail,
//       dto.current
//     );
//   }

//   @UseGuards(JwtGuard)
//   @Post("enot")
//   createPaymentLava(@Body() dto: any, @GetUser("email") userEmail: string) {
//     return this.paymentService.createPaymentLava(
//       dto.price,
//       dto.system,
//       dto.type,
//       dto.aim,
//       userEmail,
//       dto.current
//     );
//   }
// }
