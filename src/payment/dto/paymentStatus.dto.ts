import { IsNotEmpty, IsNumber, IsString } from "class-validator";

class PaymentObject {
    id: string
    status: string
    amount: { value: string, currency: string }
    description: string
    recipient: { account_id: string, gateway_id: string }
    payment_method: {
        type: string,
        id: string,
        saved: boolean,
        title: string,
        card: Object
    }
    reated_at: string
    expires_at: string
    test: boolean
    paid: boolean
}

export class PaymentStatusDto {
    @IsString()
    @IsNotEmpty()
    id: string

    @IsString()
    @IsNotEmpty()
    event: string

    @IsString()
    @IsNotEmpty()
    type: string

    @IsNotEmpty()
    object: PaymentObject

}