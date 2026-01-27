import {
  Injectable,
  ConflictException,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
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

  /**
   * 軟刪除使用者（停用帳號）
   * @param userId 要停用的使用者 ID
   * @param currentUserId 目前操作的使用者 ID（用於保護機制）
   * @returns 更新後的使用者
   */
  async deactivateUser(
    userId: number,
    currentUserId: number,
  ): Promise<User> {
    const targetUser = await this.findOne({ id: userId });
    if (!targetUser) {
      throw new NotFoundException('使用者不存在');
    }

    // 不能停用自己
    if (userId === currentUserId) {
      throw new BadRequestException('無法停用自己的帳號');
    }

    // 如果是管理員，需要檢查保護機制
    if (targetUser.role === Role.ADMIN) {
      // 檢查是否為主要管理員（透過環境變數指定）
      const primaryAdminEmail = process.env.ADMIN_EMAIL;
      if (primaryAdminEmail && targetUser.email === primaryAdminEmail) {
        throw new ForbiddenException('無法停用主要管理員帳號');
      }

      // 檢查是否至少還有一個啟用的管理員
      const activeAdmins = await this.prisma.user.findMany({
        where: {
          role: Role.ADMIN,
          isActive: true,
          id: { not: userId }, // 排除要停用的管理員
        },
      });

      if (activeAdmins.length === 0) {
        throw new BadRequestException(
          '無法停用此管理員，系統至少需要保留一個啟用的管理員',
        );
      }
    }

    return this.update({
      where: { id: userId },
      data: { isActive: false },
    });
  }

  /**
   * 啟用使用者帳號（僅管理員可操作）
   * @param userId 要啟用的使用者 ID
   * @returns 更新後的使用者
   */
  async activateUser(userId: number): Promise<User> {
    const user = await this.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('使用者不存在');
    }

    return this.update({
      where: { id: userId },
      data: { isActive: true },
    });
  }

  /**
   * 使用者停用自己的帳號
   * @param userId 使用者 ID
   * @returns 更新後的使用者
   */
  async deactivateOwnAccount(userId: number): Promise<User> {
    const user = await this.findOne({ id: userId });
    if (!user) {
      throw new BadRequestException('使用者不存在');
    }

    // 如果是管理員，需要檢查是否為最後一個啟用的管理員
    if (user.role === Role.ADMIN) {
      const activeAdmins = await this.prisma.user.findMany({
        where: {
          role: Role.ADMIN,
          isActive: true,
          id: { not: userId },
        },
      });

      if (activeAdmins.length === 0) {
        throw new BadRequestException(
          '無法停用自己的帳號，系統至少需要保留一個啟用的管理員',
        );
      }
    }

    return this.update({
      where: { id: userId },
      data: { isActive: false },
    });
  }
}
