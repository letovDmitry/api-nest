import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { PrismaService } from "src/prisma/prisma.service";
const crypto = require('crypto');

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async createPaymentEnot(
    amount: number,
    system: string,
    type: string,
    aim: string,
    email: string,
    current: string
  ) {
    const data = await axios.post(
      "https://api.enot.io/invoice/create",
      {
        amount,
        order_id: "1",
        currency: "RUB",
        custom_fields: `{"system": "${system}", "type": "${type}", "aim": "${aim}", "email": "${email}", "current": "${current}"}`,
        shop_id: this.config.get<string>("ENOT_SHOP_ID"),
      },
      {
        headers: {
          "x-api-key": this.config.get<string>("X_API_KEY"),
        },
      }
    );

    return { url: data.data.url };
  }

  async createPaymentLava(
    amount: number,
    system: string,
    type: string,
    aim: string,
    email: number,
    current: string
  ) {

    const body = {
        sum: amount,
        order_id: "1",
        email: "test.test@example.com",
        currency: "RUB",
        custom_fields: `{"system": "${system}", "type": "${type}", "aim": "${aim}", "email": "${email}", "current": "${current}"}`,
        shop_id: this.config.get<string>("LAVA_SHOP_ID"),
      };
    const secretKey = this.config.get<string>("LAVA_SECRET_KEY")
    const signature = crypto.createHmac("sha256", secretKey).update(JSON.stringify(body)).digest("hex");


    const data = await axios.post(
      "https://api.lava.ru/business/invoice/create",
      body,
      {
        headers: {
          "Signature": signature,
        },
      }
    );

    return { url: data.data.url };
  }
}
