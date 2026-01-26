import {
  Body,
  Controller,
  Post,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ApiKeyGuard } from './api-key.guard';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('ApiKeyAuth')
  @ApiOperation({
    summary: '使用者登入',
    description: '使用 email 和密碼登入，成功後會回傳 JWT access_token',
  })
  @ApiResponse({
    status: 200,
    description: '登入成功',
    schema: {
      example: {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGhhdGdpdmVtZS5jb20iLCJzdWIiOjEsInJvbGUiOiJBRE1JTiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxNjE2MjQyNjIyfQ',
        user: {
          id: 1,
          email: 'admin@hatgiveme.com',
          name: '系統管理員',
          role: 'ADMIN',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '登入失敗：帳號或密碼錯誤',
  })
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('ApiKeyAuth')
  @ApiOperation({
    summary: '使用者註冊',
    description: '註冊新使用者帳號，註冊成功後會自動登入並回傳 JWT access_token',
  })
  @ApiResponse({
    status: 201,
    description: '註冊成功',
    schema: {
      example: {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJzdWIiOjIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjE2MjM5MDIyLCJleHAiOjE2MTYyNDI2MjJ9',
        user: {
          id: 2,
          email: 'user@example.com',
          name: '王大明',
          role: 'USER',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: '註冊失敗：Email 已被使用',
  })
  @ApiResponse({
    status: 401,
    description: 'API Key 驗證失敗',
  })
  async register(@Body() body: RegisterDto) {
    // Ideally validation logic here
    const user = await this.authService.register(body);
    const { password, ...userWithoutPassword } = user;
    return this.authService.login(userWithoutPassword);
  }

  @Patch('change-password')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('AccessTokenAuth')
  @ApiOperation({
    summary: '修改密碼',
    description: '修改密碼需要提供舊密碼進行驗證',
  })
  @ApiResponse({
    status: 200,
    description: '密碼修改成功',
    schema: {
      example: {
        message: '密碼修改成功',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '舊密碼錯誤或使用者不存在',
  })
  async changePassword(@Req() req: any, @Body() body: ChangePasswordDto) {
    const userId = req.user?.sub || req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException('無法取得使用者資訊');
    }

    await this.authService.changePassword(
      userId,
      body.oldPassword,
      body.newPassword,
    );

    return { message: '密碼修改成功' };
  }
}
