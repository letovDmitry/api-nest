import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getMessagesByOrderId(orderId: number, userId: number) {
    const chat = await this.prisma.chat.findUnique({
      where: {
        orderId,
      },
      include: {
        messages: true,
      },
    });

    if (chat.user1Id === userId || chat.user2Id === userId) {
      return chat.messages;
    }
  }

  async createMessage(userId: number, orderId: number, text: string) {
    const chat = await this.prisma.chat.findUnique({
      where: {
        orderId,
      },
    });

    if (chat.user1Id === userId || chat.user2Id === userId) {
      return await this.prisma.message.create({
        data: {
          chatId: chat.id,
          text,
          senderId: userId,
        },
      });
    }
  }
}
