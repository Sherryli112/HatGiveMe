import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: '使用者 email',
    example: 'admin@hatgiveme.com',
  })
  @IsEmail({}, { message: '請輸入有效的 email' })
  email: string;

  @ApiProperty({
    description: '使用者密碼',
    example: 'hat1234',
  })
  @IsString({ message: '密碼必須是字串' })
  password: string;
}
