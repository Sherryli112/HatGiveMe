import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: '訂單狀態',
    enum: OrderStatus,
    example: OrderStatus.PAID,
  })
  @IsEnum(OrderStatus, {
    message: 'status 必須為 PENDING | PAID | SHIPPED | COMPLETED | CANCELLED 其中之一',
  })
  status: OrderStatus;
}
