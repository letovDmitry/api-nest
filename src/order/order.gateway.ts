import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket } from "socket.io";

@WebSocketGateway({
  cors: true,
})
export class OrderGateway {
  constructor() {}

  @WebSocketServer()
  server;

  async handleEmitNotification() {
    this.server.emit('newOrder')
  }
}
