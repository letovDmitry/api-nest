import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { JwtGuard } from "src/auth/guard";
import { GetUser } from "src/auth/decorator";

@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtGuard)
  @Get("member")
  getOrdersForMember(@GetUser("id") userId: number) {
    return this.orderService.getOrdersForMember(userId);
  }

  @UseGuards(JwtGuard)
  @Get("booster_new")
  getNewOrdersForBooster(@GetUser("id") userId: number) {
    return this.orderService.getNewOrdersForBooster(userId);
  }

  @UseGuards(JwtGuard)
  @Get("booster")
  getOrdersForBooster(@GetUser("id") userId: number) {
    return this.orderService.getOrdersForBooster(userId);
  }

  @Post('yookassa')
  createOrderYookassa(@Body() dto: any) {
    return this.orderService.createOrderYookassa(dto);
  }

  @Post('enot')
  createOrderEnot(@Body() dto: any) {
    return this.orderService.createOrderEnot(dto);
  }

  @Get('selfwork')
  createOrderSelfwork(@Query() query) {
    const dto = { custom_fields: query }
    return this.orderService.createOrderSelfwork(dto);
  }

  @UseGuards(JwtGuard)
  @Put("complete/:id")
  completeOrderForBooster(@Param("id", ParseIntPipe) orderId: number) {
    return this.orderService.completeOrderForBooster(orderId);
  }

  @UseGuards(JwtGuard)
  @Put("/:id")
  takeOrderForBooster(
    @GetUser("id") userId: number,
    @Param("id", ParseIntPipe) orderId: number
  ) {
    return this.orderService.takeOrderForBooster(orderId, userId);
  }
}
