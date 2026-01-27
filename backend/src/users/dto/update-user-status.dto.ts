import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateUserStatusDto {
  @ApiProperty({
    description: '是否啟用帳號',
    example: true,
  })
  @Transform(({ value }) => {
    if (value === true || value === false) return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'isActive 必須為 true 或 false' })
  isActive: boolean;
}
