import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getUnseenMessagesAndChats(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: {
        OR: [
          { userId },
          { boosterId: userId }
        ]
      },
      include: {
        chat: {
          include: {
            messages: true
          }
        },
      },
    });

    const unseenMessagesByOrder = orders.map(o => ({
      id: o.id,
      unseen: o?.chat?.messages?.filter(m => !m.seen && m.senderId !== userId).length
    }));

    return unseenMessagesByOrder
  }

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
      await this.prisma.message.updateMany({
        where: {
          chatId: chat.id,
          seen: false,
          NOT: {
            senderId: userId
          }
        },
        data: {
          seen: true
        }
      })
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
        include: {
          chat: true
        }
      });
    }
  }
}
