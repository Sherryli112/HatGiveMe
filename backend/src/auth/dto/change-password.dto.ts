import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: '舊密碼',
    example: 'oldPassword123',
  })
  @IsString({ message: '舊密碼必須是字串' })
  oldPassword: string;

  @ApiProperty({
    description: '新密碼',
    example: 'newPassword123',
    minLength: 6,
  })
  @IsString({ message: '新密碼必須是字串' })
  @MinLength(6, { message: '新密碼長度至少 6 個字元' })
  newPassword: string;
}