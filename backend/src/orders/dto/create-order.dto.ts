import {
  IsArray,
  IsString,
  MinLength,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @ApiProperty({
    description: '訂單項目（商品與數量）',
    type: [CreateOrderItemDto],
    example: [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 1 },
    ],
  })
  @IsArray({ message: 'items 必須為陣列' })
  @ArrayMinSize(1, { message: '至少需要一項商品' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiProperty({
    description: '收貨地址',
    example: '台北市信義區信義路五段7號',
  })
  @IsString({ message: 'shippingAddress 必須為字串' })
  @MinLength(1, { message: '請填寫收貨地址' })
  shippingAddress: string;

  @ApiProperty({
    description: '收貨人姓名',
    example: '王小明',
  })
  @IsString({ message: 'receiverName 必須為字串' })
  @MinLength(1, { message: '請填寫收貨人姓名' })
  receiverName: string;

  @ApiProperty({
    description: '收貨人電話',
    example: '0912345678',
  })
  @IsString({ message: 'receiverPhone 必須為字串' })
  @MinLength(1, { message: '請填寫收貨人電話' })
  receiverPhone: string;
}
