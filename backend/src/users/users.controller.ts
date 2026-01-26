import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
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

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Placeholder for "Get My Profile" - needs Auth
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Req() req) {
    // req.user will be populated by JwtStrategy
    // return this.usersService.findOne({ id: req.user.userId });
    return { message: 'Auth not implemented yet' };
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(
    @Req() req,
    @Body() data: { name?: string; password?: string },
  ) {
    // return this.usersService.update({ where: { id: req.user.userId }, data });
    return { message: 'Auth not implemented yet' };
  }

  // Admin: Get all users
  @Get()
  @ApiOperation({ summary: 'Admin: Get all users' })
  async findAll() {
    return this.usersService.findAll({});
  }

  // Admin: Create new admin
  @Post('admin')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth('AccessTokenAuth')
  @ApiOperation({ summary: 'Admin: 建立新管理員帳號' })
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

  // Admin: Update status
  @Patch(':id/status')
  @ApiOperation({ summary: 'Admin: Update user status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() data: { isActive: boolean },
  ) {
    return this.usersService.update({
      where: { id: +id },
      data: { isActive: data.isActive },
    });
  }
}
