import { Body, Controller, Post, UnauthorizedException, UsePipes } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { z } from 'zod';

import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import { PrismaService } from '@/prisma/prisma.service';

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type AuthSchema = z.infer<typeof authSchema>;

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService
  ) {}

  @Post()
  // @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authSchema))
  async handle(@Body() body: AuthSchema) {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('User credentials do not match');

    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) throw new UnauthorizedException('User credentials do not match');

    const accessToken = this.jwt.sign({ sub: user.id });

    return {
      access_token: accessToken,
    };
  }
}
