import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { JwtGuard } from "src/auth/guard";
import { GetUser } from "src/auth/decorator";

@Controller("payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtGuard)
  @Post("enot")
  createPaymentEnot(@Body() dto: any, @GetUser("email") userEmail: string) {
    return this.paymentService.createPaymentEnot(
      dto.price,
      dto.system,
      dto.type,
      dto.aim,
      userEmail,
      dto.current
    );
  }
}
