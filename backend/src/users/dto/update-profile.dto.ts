import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: '使用者名稱（暱稱）',
    example: '王大明',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: '名稱必須是字串' })
  @MaxLength(100, { message: '名稱不可超過 100 字元' })
  name?: string;
}
