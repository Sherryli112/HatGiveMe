import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({
    description: '管理員 email',
    example: 'admin@example.com',
  })
  @IsEmail({}, { message: '請輸入有效的 email' })
  email: string;

  @ApiProperty({
    description: '管理員密碼',
    example: 'password',
    minLength: 6,
  })
  @IsString({ message: '密碼必須是字串' })
  @MinLength(6, { message: '密碼長度至少 6 個字元' })
  password: string;

  @ApiPropertyOptional({
    description: '管理員名稱（選填）',
    example: '系統管理員',
  })
  @IsOptional()
  @IsString({ message: '名稱必須是字串' })
  name?: string;
}
