import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class PaymentDto {
    @IsNumber()
    @IsNotEmpty()
    amount: number

    @IsNumber()
    @IsNotEmpty()
    orderId: number
}