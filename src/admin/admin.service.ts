import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getBoosters() {
    const boosters =  await this.prisma.user.findMany({
      where: {
        isBooster: true
      }
    })
    console.log(boosters)
    return boosters
  }
  
  async approveBooster(boosterId: number) {
    return await this.prisma.user.update({
      where: {
        id: boosterId
      },
      data: {
        isApproved: true
      }
    })
  }

  async cancelBooster(boosterId: number) {
    return await this.prisma.user.delete({
      where: {
        id: boosterId
      }
    })
  }

  async deleteBooster(boosterId: number) {
    return await this.prisma.user.delete({
      where: {
        id: boosterId
      }
    })
  }
  
  async createBooster(dto: { email: string, password: string }) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          isBooster: true,
          isApproved: true,
          hash,
        },
      });
      console.log(user)
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2002")
          throw new ForbiddenException("Credentials taken");
      }
    }
  }
}
