import { Controller, Post, Body, HttpCode } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common/enums";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post("recover")
  recoverPassword(@Body() dto: AuthDto) {
    return this.authService.recoverPassword(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post("signin")
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}
