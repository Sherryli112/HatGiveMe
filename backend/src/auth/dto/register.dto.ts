import { Prisma } from '@prisma/client';

export class RegisterDto implements Prisma.UserCreateInput {
  email: string;
  password: string;
  name?: string;
}
