import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class RegisterDto implements Prisma.UserCreateInput {
  @ApiProperty({
    description: '使用者 email',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '請輸入有效的 email' })
  email: string;

  @ApiProperty({
    description: '使用者密碼',
    example: 'password',
    minLength: 6,
  })
  @IsString({ message: '密碼必須是字串' })
  @MinLength(6, { message: '密碼長度至少 6 個字元' })
  password: string;

  @ApiPropertyOptional({
    description: '使用者名稱（選填）',
    example: '王大明',
  })
  @IsOptional()
  @IsString({ message: '名稱必須是字串' })
  name?: string;
}
