import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Delete,
  Req,
  UnauthorizedException,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('AccessTokenAuth')
  @ApiOperation({ summary: '取得目前使用者資料' })
  @ApiResponse({
    status: 200,
    description: '成功取得目前使用者資料',
    schema: {
      example: {
        id: 1,
        email: 'user@example.com',
        name: '王大明',
        role: 'USER',
        isActive: true,
        createdAt: '2025-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: '未登入或 token 無效' })
  @ApiResponse({ status: 404, description: '使用者不存在或已停用' })
  async getProfile(@Req() req: any) {
    const userId = req.user?.sub ?? req.user?.userId;
    const user = await this.usersService.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('使用者不存在');
    }
    if (!user.isActive) {
      throw new NotFoundException('帳號已停用');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Patch('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('AccessTokenAuth')
  @ApiOperation({ summary: '更新目前使用者資料' })
  @ApiResponse({
    status: 200,
    description: '更新成功',
    schema: {
      example: {
        id: 1,
        email: 'user@example.com',
        name: '王大明',
        role: 'USER',
        isActive: true,
        createdAt: '2025-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: '驗證失敗' })
  @ApiResponse({ status: 401, description: '未登入或 token 無效' })
  async updateProfile(
    @Req() req: any,
    @Body() data: UpdateProfileDto,
  ) {
    const userId = req.user?.sub ?? req.user?.userId;
    const user = await this.usersService.update({
      where: { id: userId },
      data,
    });
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // 使用者停用自己的帳號
  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('AccessTokenAuth')
  @ApiOperation({
    summary: '停用自己的帳號',
    description: '使用者可以停用自己的帳號',
  })
  @ApiResponse({
    status: 200,
    description: '帳號已停用',
  })
  @ApiResponse({
    status: 400,
    description: '無法停用：系統至少需要保留一個啟用的管理員',
  })
  async deactivateOwnAccount(@Req() req: any) {
    const userId = req.user?.sub || req.user?.userId;
    const user = await this.usersService.deactivateOwnAccount(userId);
    const { password, ...userWithoutPassword } = user;
    return {
      message: '帳號已停用',
      user: userWithoutPassword,
    };
  }

  // Admin: Get all users
  @Get()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth('AccessTokenAuth')
  @ApiOperation({ summary: '取得所有使用者列表【管理員】' })
  @ApiResponse({
    status: 200,
    description: '取得使用者列表成功',
  })
  @ApiResponse({
    status: 403,
    description: '僅管理員可執行此操作',
  })
  async findAll() {
    const users = await this.usersService.findAll({});
    return users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  // Admin: Create new admin
  @Post('admin')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth('AccessTokenAuth')
  @ApiOperation({ summary: '建立新管理員帳號【管理員】' })
  @ApiResponse({
    status: 201,
    description: '管理員帳號建立成功',
  })
  @ApiResponse({
    status: 409,
    description: 'Email 已被使用',
  })
  @ApiResponse({
    status: 403,
    description: '僅管理員可執行此操作',
  })
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    const admin = await this.usersService.createAdmin(createAdminDto);
    // 移除密碼後回傳
    const { password, ...adminWithoutPassword } = admin;
    return {
      message: '管理員帳號建立成功',
      user: adminWithoutPassword,
    };
  }

  // Admin: Update status (啟用/停用使用者)
  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth('AccessTokenAuth')
  @ApiOperation({
    summary: '啟用/停用使用者帳號【管理員】',
    description: '管理員可以啟用或停用其他使用者的帳號',
  })
  @ApiResponse({
    status: 200,
    description: '帳號狀態更新成功',
  })
  @ApiResponse({
    status: 400,
    description: '無法停用：不能停用自己、主要管理員，或系統至少需要保留一個啟用的管理員；或請求體驗證失敗',
  })
  @ApiResponse({
    status: 403,
    description: '僅管理員可執行此操作',
  })
  @ApiResponse({
    status: 404,
    description: '使用者不存在',
  })
  async updateStatus(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserStatusDto,
  ) {
    const currentUserId = req.user?.sub ?? req.user?.userId;
    if (currentUserId === undefined) {
      throw new UnauthorizedException('無法取得使用者資訊');
    }

    if (data.isActive) {
      const user = await this.usersService.activateUser(id);
      const { password, ...userWithoutPassword } = user;
      return {
        message: '帳號已啟用',
        user: userWithoutPassword,
      };
    } else {
      const user = await this.usersService.deactivateUser(id, currentUserId);
      const { password, ...userWithoutPassword } = user;
      return {
        message: '帳號已停用',
        user: userWithoutPassword,
      };
    }
  }
}