import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import { JwtGuard } from "src/auth/guard";
import { GetUser } from "src/auth/decorator";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtGuard)
  @Get("/:id")
  getMessagesByOrderId(
    @Param("id", ParseIntPipe) orderId: number,
    @GetUser("id") userId: number
  ) {
    return this.chatService.getMessagesByOrderId(orderId, userId);
  }

  @UseGuards(JwtGuard)
  @Post("")
  createMessage(
    @GetUser("id") userId: number,
    @Body() dto: { orderId: number; text: string }
  ) {
    return this.chatService.createMessage(userId, dto.orderId, dto.text);
  }
}
