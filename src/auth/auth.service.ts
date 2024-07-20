import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { JwtService } from "@nestjs/jwt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ForbiddenException } from "@nestjs/common/exceptions";
import { ConfigService } from "@nestjs/config";
import { generatePassword } from "./helpers/generatePassword";
import { sendMail } from "./helpers/mail";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async recoverPassword(dto: AuthDto) {
    const password = generatePassword();
    const hash = await argon.hash(password);

    try {
      const user = await this.prisma.user.update({
        where: {
          email: dto.email,
        },
        data: {
          hash,
        }
      });

      await sendMail(password, dto.email);

      console.log(password);

      return this.signToken(user.id, user.email, user.isBooster);
    } catch (e) {
      throw new ForbiddenException("This email does not exist");
    }
  }

  async signup(dto: AuthDto) {
    const password = generatePassword();
    const hash = await argon.hash(password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          isBooster: dto.isBooster,
          hash,
        },
      });

      await sendMail(password, dto.email);

      console.log(password);

      return this.signToken(user.id, user.email, user.isBooster);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2002")
          throw new ForbiddenException("Credentials taken");
      }
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException("Credentials incorrect");

    const pwMatches = await argon.verify(user.hash, dto.password);

    if (!pwMatches) throw new ForbiddenException("Credentials incorrect");

    return this.signToken(user.id, user.email, user.isBooster);
  }

  async signToken(
    userId: number,
    email: string,
    isBooster: boolean
  ): Promise<{ access_token: string; isBooster: boolean }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get<string>("JWT_SECRET");
    const token = await this.jwt.signAsync(payload, {
      expiresIn: "24h",
      secret,
    });

    return {
      access_token: token,
      isBooster,
    };
  }
}
