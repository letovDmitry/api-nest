import { Controller, Get, UseGuards, Put, Body, Delete } from "@nestjs/common";
import { User } from "@prisma/client";
import { GetUser } from "src/auth/decorator";
import { JwtGuard } from "src/auth/guard";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get("me")
  getMe(@GetUser() user: User) {
    return user;
  }

  @UseGuards(JwtGuard)
  @Put("password")
  changePassword(
    @GetUser("id") userId: number,
    @Body() dto: { newPassword: string }
  ) {
    return this.userService.changePassword(userId, dto.newPassword);
  }

  @UseGuards(JwtGuard)
  @Put("")
  changeUser(@GetUser("id") userId: number, @Body() dto: Partial<User>) {
    return this.userService.changeUser(dto, userId);
  }

  @UseGuards(JwtGuard)
  @Delete("")
  deleteUser(@GetUser("id") userId: number) {
    return this.userService.deleteUser(userId);
  }
}
