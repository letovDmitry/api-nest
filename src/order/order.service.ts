import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(dto: any) {
    if (dto.status === "success") {
      const order = await this.prisma.order.create({
        data: {
          system: dto.custom_fields.system,
          goal: dto.custom_fields.goal,
          current: dto.custom_fields.current,
          type: dto.custom_fields.type,
          options: dto.custom_fields.options,
          status: "Поиск бустера",
          user: {
            connect: {
              email: dto.custom_fields.email,
            },
          },
        },
      });

      return order;
    }
  }

  async getNewOrdersForBooster() {
    const orders = await this.prisma.order.findMany({
      where: {
        status: "Поиск бустера",
      },
      orderBy: {
        id: "asc",
      },
    });

    return orders;
  }

  async takeOrderForBooster(orderId: number, userId: number) {
    const order = await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        boosterId: userId,
        status: "В процессе",
      },
    });

    await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        chat: {
          create: {
            user1Id: order.userId,
            user2Id: order.boosterId,
          },
        },
      },
    });

    return order;
  }

  async completeOrderForBooster(orderId: number) {
    const order = await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "Выполнен",
      },
    });

    return order;
  }

  async getOrdersForBooster(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: {
        boosterId: userId,
      },
      orderBy: {
        id: "asc",
      },
      include: {
        booster: true,
        user: true,
      },
    });

    return orders;
  }

  async getOrdersForMember(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
      },
      orderBy: {
        id: "asc",
      },
      include: {
        booster: true,
        user: true,
      },
    });

    return orders;
  }
}
