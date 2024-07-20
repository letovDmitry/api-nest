import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
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

  @Get("booster_new")
  getNewOrdersForBooster() {
    return this.orderService.getNewOrdersForBooster();
  }

  @UseGuards(JwtGuard)
  @Get("booster")
  getOrdersForBooster(@GetUser("id") userId: number) {
    return this.orderService.getOrdersForBooster(userId);
  }

  @Post()
  createOrder(@Body() dto: any) {
    return this.orderService.createOrder(dto);
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
