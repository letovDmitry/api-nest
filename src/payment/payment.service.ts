import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { OrderService } from 'src/order/order.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as Yookassa from 'yookassa'
import { PaymentDto, PaymentStatusDto } from './dto';

const yooKassa = new Yookassa({
    shopId: process.env.SHOP_ID,
    secretKey: process.env.SECRET_KEY
})

@Injectable()
export class PaymentService {
    constructor(private prisma: PrismaService) {}
    
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
        console.log(dto)
        if (dto.event !== 'payment.waiting_for_capture') return

        console.log(dto)

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

