import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { ChatService } from "./chat.service";

@WebSocketGateway({
  cors: true,
})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server;

  async handleConnection(client: Socket): Promise<void> {
    const chatId = client.handshake.query.chatId;

    client.join(chatId);
  }

  @SubscribeMessage("message")
  async handleMessage(client: any, payload: any) {
    const newMessage = await this.chatService.createMessage(
      payload.senderId,
      parseInt(payload.orderId),
      payload.text
    );

    client.to(payload.orderId).emit("message", newMessage);
  }
}
