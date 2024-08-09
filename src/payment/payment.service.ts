import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { OrderService } from 'src/order/order.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as Yookassa from 'yookassa'
import { PaymentDto, PaymentStatusDto } from './dto';
import axios from 'axios';
import { createHash } from 'crypto';
import { OrderGateway } from 'src/order/order.gateway';

const yooKassa = new Yookassa({
    shopId: process.env.SHOP_ID,
    secretKey: process.env.SECRET_KEY
})

@Injectable()
export class PaymentService {
    constructor(private prisma: PrismaService, private ordersGateway: OrderGateway) {}
    
    async payment(dto: PaymentDto) {
        const payment = await yooKassa.createPayment({
            amount: {
              value: dto.amount,
              currency: "RUB"
            },
            payment_method_data: {
                type: "bank_card"
            },
            confirmation: {
              type: "redirect",
              return_url: "https://anyboost.ru/payment-success"
            },
            description: `${dto.orderId}`
        });

        return payment
    }

    async getPaymentStatus(dto: PaymentStatusDto) {
        // console.log(dto)
        if (dto.event !== 'payment.waiting_for_capture') return

        // console.log(dto)

        const payment = await yooKassa.capturePayment(
            dto.object.id,
            dto.object.amount
        )
        
        console.log(payment.description)

        const orderId: number = parseInt(payment.description)

        const order = await this.prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                status: 'Поиск бустера'
            }
        })

        this.ordersGateway.handleEmitNotification()

        console.log(order)
    }

    async createPaymentEnot(
        amount: number,
        orderId: string
    ) {
        const data = await axios.post(
        "https://api.morune.com/invoice/create",
        {
            amount,
            order_id: orderId,
            currency: "RUB",
            shop_id: process.env.ENOT_SHOP_ID,
        },
        {
            headers: {
                "x-api-key": process.env.X_API_KEY,
            },
        }
        );

        return { url: data.data.data.url };
    }

    async getPaymentStatusEnot(dto: any) {
        console.log(dto)
        if (dto.status !== 'success') return

        const order = await this.prisma.order.update({
            where: {
                id: parseInt(dto.order_id)
            },
            data: {
                status: 'Поиск бустера'
            }
        })

        this.ordersGateway.handleEmitNotification()

        console.log(order)
    }

    async createPaymentSelfwork(
        amount: string,
        orderId: string
    ) {
        const body: { order_id: string, amount: string, info: Array< { name: string, quantity: number, amount: number } >, signature?: string } = {
            order_id: orderId,
            amount: (parseInt(amount)*100).toString(),
            info: [{
                name: 'Буст',
                quantity: 1,
                amount: parseInt(amount)*100
            }]
        }

        const apiKey = process.env.SELFWORK_API_KEY

        const signature = createHash('sha256').update(body.order_id + body.amount + body.info[0].name + body.info[0].quantity + + body.info[0].amount + apiKey).digest('hex');

        body.signature = signature

        const data = await axios.post(
        "https://pro.selfwork.ru/merchant/v1/init", body, { headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Origin": "https://anyboost.ru/",
            "Referer": "anyboost.ru"
        } });

        console.log(data.data)
        return data.data;
    }

    async getPaymentStatusSelfwork(dto: any) {
        console.log(dto)
        if (dto.status !== 'succeeded') return

        const order = await this.prisma.order.update({
            where: {
                id: parseInt(dto.order_id)
            },
            data: {
                status: 'Поиск бустера'
            }
        })

        this.ordersGateway.handleEmitNotification()

        console.log(order)
    }

}

// import { Injectable } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import axios from "axios";
// import { PrismaService } from "src/prisma/prisma.service";
// const crypto = require('crypto');

// @Injectable()
// export class PaymentService {
//   constructor(private prisma: PrismaService, private config: ConfigService) {}

//   async createPaymentEnot(
//     amount: number,
//     system: string,
//     type: string,
//     aim: string,
//     email: string,
//     current: string
//   ) {
//     const data = await axios.post(
//       "https://api.enot.io/invoice/create",
//       {
//         amount,
//         order_id: "1",
//         currency: "RUB",
//         custom_fields: `{"system": "${system}", "type": "${type}", "aim": "${aim}", "email": "${email}", "current": "${current}"}`,
//         shop_id: this.config.get<string>("ENOT_SHOP_ID"),
//       },
//       {
//         headers: {
//           "x-api-key": this.config.get<string>("X_API_KEY"),
//         },
//       }
//     );

//     return { url: data.data.url };
//   }

//   async createPaymentLava(
//     amount: number,
//     system: string,
//     type: string,
//     aim: string,
//     email: string,
//     current: string
//   ) {

//     const body = {
//         sum: amount,
//         order_id: "1",
//         email: "test.test@example.com",
//         currency: "RUB",
//         custom_fields: `{"system": "${system}", "type": "${type}", "aim": "${aim}", "email": "${email}", "current": "${current}"}`,
//         shop_id: this.config.get<string>("LAVA_SHOP_ID"),
//       };
//     const secretKey = this.config.get<string>("LAVA_SECRET_KEY")
//     const signature = crypto.createHmac("sha256", secretKey).update(JSON.stringify(body)).digest("hex");


//     const data = await axios.post(
//       "https://api.lava.ru/business/invoice/create",
//       body,
//       {
//         headers: {
//           "Signature": signature,
//         },
//       }
//     );

//     return { url: data.data.url };
//   }
// }

