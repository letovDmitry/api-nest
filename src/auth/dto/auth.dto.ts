import { IsEmail, IsBoolean, IsOptional } from "class-validator";
import { IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  isBooster?: boolean;
}
