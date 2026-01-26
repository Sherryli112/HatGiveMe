import {
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, Role } from '@prisma/client';
import { hashPassword } from '../common/utils/password.util';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    // 一般使用者註冊
    const hashedPassword = await hashPassword(data.password as string);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: 'USER', // 一般註冊只能是 USER
      },
    });
  }

  /**
   * 由現有管理員建立新管理員帳號
   * @param data 管理員資料
   * @returns 建立的其他管理員使用者
   */
  async createAdmin(data: {
    email: string;
    password: string;
    name?: string;
  }): Promise<User> {
    // 檢查 email 是否已存在
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('此 email 已被使用');
    }

    // 建立管理員帳號
    const hashedPassword = await hashPassword(data.password);
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name || '管理員',
        role: Role.ADMIN,
        isActive: true,
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where,
    });
  }

  // Find by email strictly
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    // Hash password if it's being updated
    if (typeof data.password === 'string') {
      data.password = await hashPassword(data.password);
    }
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async remove(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
