import { Body, ConflictException, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { z } from 'zod';

import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';

const createAccountSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

type CreateAccountSchema = z.infer<typeof createAccountSchema>;

@Controller('/accounts')
export class CreateAccountController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  async handle(@Body() body: CreateAccountSchema) {
    const { name, email, password } = createAccountSchema.parse(body);

    const userExists = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) throw new ConflictException('User already exists');

    const hashedPassword = await hash(password, 8);

    await this.prisma.user.create({ data: { name, email, password: hashedPassword } });
  }
}
