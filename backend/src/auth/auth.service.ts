import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User, Prisma } from '@prisma/client';
import { comparePassword } from '../common/utils/password.util';

type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await comparePassword(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserWithoutPassword) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(data: Prisma.UserCreateInput) {
    return this.usersService.create(data);
  }

  /**
   * 修改使用者密碼
   * @param userId 使用者 ID
   * @param oldPassword 舊密碼
   * @param newPassword 新密碼
   */
  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.usersService.findOne({ id: userId });
    if (!user) {
      throw new UnauthorizedException('使用者不存在');
    }

    // 驗證舊密碼
    const isOldPasswordValid = await comparePassword(
      oldPassword,
      user.password,
    );
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('舊密碼錯誤');
    }

    // 更新密碼
    await this.usersService.update({
      where: { id: userId },
      data: { password: newPassword },
    });
  }
}
