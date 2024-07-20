import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from "argon2";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async changeUser(data: Partial<User>, userId: number) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data,
    });
  }

  async changePassword(userId: number, newPassword: string) {
    const hash = await argon.hash(newPassword);

    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hash,
      },
    });

    return user;
  }

  async deleteUser(userId: number) {
    return await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
}
