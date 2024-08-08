import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { OrderGateway } from "./order.gateway";
import { PaymentService } from "src/payment/payment.service";
import { Order } from "@prisma/client";

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService, private ordersGateway: OrderGateway, private paymentService: PaymentService) {}

  async createOrderSelfwork(dto: any) {
    const order = await this.prisma.order.create({
      data: {
        system: dto.custom_fields.system,
        goal: dto.custom_fields.goal,
        current: dto.custom_fields.current,
        type: dto.custom_fields.type,
        options: dto.custom_fields.options,
        status: "Ожидание оплаты",
        user: {
          connect: {
            email: dto.custom_fields.email,
          },
        },
      },
    });

    const payment = await this.paymentService.createPaymentSelfwork( dto.custom_fields.price, order.id.toString() )

    this.ordersGateway.handleEmitNotification()

    return payment;
}

  async createOrderYookassa(dto: any) {
      const order = await this.prisma.order.create({
        data: {
          system: dto.custom_fields.system,
          goal: dto.custom_fields.goal,
          current: dto.custom_fields.current,
          type: dto.custom_fields.type,
          options: dto.custom_fields.options,
          status: "Ожидание оплаты",
          user: {
            connect: {
              email: dto.custom_fields.email,
            },
          },
        },
      });

      const payment = await this.paymentService.payment({ amount: dto.custom_fields.price, orderId: order.id })

      this.ordersGateway.handleEmitNotification()

      return payment.confirmation;
  }

  async createOrderEnot(dto: any) {
    const order = await this.prisma.order.create({
      data: {
        system: dto.custom_fields.system,
        goal: dto.custom_fields.goal,
        current: dto.custom_fields.current,
        type: dto.custom_fields.type,
        options: dto.custom_fields.options,
        status: "Ожидание оплаты",
        user: {
          connect: {
            email: dto.custom_fields.email,
          },
        },
      },
    });

    const payment = await this.paymentService.createPaymentEnot(dto.custom_fields.price, order.id.toString() )

    this.ordersGateway.handleEmitNotification()

    return payment;
}

  async getNewOrdersForBooster(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: {
        status: "Поиск бустера",
      },
      orderBy: {
        id: "asc",
      },
      include: {
        seenBy: true
      }
    });

    orders.forEach(async o => {
      await this.prisma.order.update({
        where: {
          id: o.id
        },
        data: {
          seenBy: {
            connect: {
              id: userId
            }
          }
        }
      })
    })

    return orders
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
        NOT: {
          status: "Ожидание оплаты"
        }
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
        NOT: {
          status: "Ожидание оплаты"
        }
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
