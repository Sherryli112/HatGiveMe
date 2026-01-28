import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({
    description: '商品 ID',
    example: 1,
  })
  @IsInt({ message: 'productId 必須為整數' })
  productId: number;

  @ApiProperty({
    description: '購買數量',
    example: 2,
    minimum: 1,
  })
  @IsInt({ message: 'quantity 必須為整數' })
  @Min(1, { message: 'quantity 至少為 1' })
  quantity: number;
}
