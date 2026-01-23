import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma, Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // Placeholder for "Get My Profile" - needs Auth
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Req() req) {
    // req.user will be populated by JwtStrategy
    // return this.usersService.findOne({ id: req.user.userId });
    return { message: "Auth not implemented yet" };
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(@Req() req, @Body() data: { name?: string; password?: string }) {
    // return this.usersService.update({ where: { id: req.user.userId }, data });
    return { message: "Auth not implemented yet" };
  }

  // Admin: Get all users
  @Get()
  @ApiOperation({ summary: 'Admin: Get all users' })
  async findAll() {
    return this.usersService.findAll({});
  }

  // Admin: Update status
  @Patch(':id/status')
  @ApiOperation({ summary: 'Admin: Update user status' })
  async updateStatus(@Param('id') id: string, @Body() data: { isActive: boolean }) {
    return this.usersService.update({
      where: { id: +id },
      data: { isActive: data.isActive },
    });
  }
}
