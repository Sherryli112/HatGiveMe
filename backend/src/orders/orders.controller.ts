import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('AccessTokenAuth')
  @ApiOperation({
    summary: '建立訂單',
    description: '登入使用者建立新訂單，需提供商品項目、收貨地址與收貨人資訊',
  })
  @ApiResponse({
    status: 201,
    description: '訂單建立成功',
    schema: {
      example: {
        id: 1,
        userId: 1,
        status: 'PENDING',
        totalAmount: 1599,
        shippingAddress: '台北市信義區信義路五段7號',
        receiverName: '王小明',
        receiverPhone: '0912345678',
        createdAt: '2025-01-26T00:00:00.000Z',
        items: [
          {
            id: 1,
            productId: 1,
            quantity: 2,
            price: 799.5,
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 400, description: '驗證失敗或商品庫存不足' })
  @ApiResponse({ status: 401, description: '未登入或 token 無效' })
  @ApiResponse({ status: 404, description: '指定商品不存在' })
  async create(@Req() req: any, @Body() body: CreateOrderDto) {
    const userId = req.user?.sub ?? req.user?.userId;
    if (userId === undefined) {
      throw new UnauthorizedException('無法取得使用者資訊');
    }
    return this.ordersService.create(userId, body);
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('AccessTokenAuth')
  @ApiOperation({
    summary: '取得我的訂單',
    description: '取得目前登入使用者的所有訂單列表',
  })
  @ApiResponse({
    status: 200,
    description: '成功取得訂單列表',
    schema: {
      example: [
        {
          id: 1,
          userId: 1,
          status: 'PENDING',
          totalAmount: 1599,
          shippingAddress: '台北市信義區信義路五段7號',
          receiverName: '王小明',
          receiverPhone: '0912345678',
          createdAt: '2025-01-26T00:00:00.000Z',
          items: [
            {
              id: 1,
              productId: 1,
              quantity: 2,
              price: 799.5,
              product: { id: 1, name: '帽子 A', price: 799.5 },
            },
          ],
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: '未登入或 token 無效' })
  async findMyOrders(@Req() req: any) {
    const userId = req.user?.sub ?? req.user?.userId;
    if (userId === undefined) {
      throw new UnauthorizedException('無法取得使用者資訊');
    }
    return this.ordersService.findMyOrders(userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth('AccessTokenAuth')
  @ApiOperation({
    summary: '取得所有訂單【管理員】',
    description: '管理員可查詢系統內所有訂單',
  })
  @ApiResponse({
    status: 200,
    description: '成功取得訂單列表',
  })
  @ApiResponse({ status: 401, description: '未登入或 token 無效' })
  @ApiResponse({ status: 403, description: '僅管理員可執行此操作' })
  async findAll() {
    return this.ordersService.findAll();
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth('AccessTokenAuth')
  @ApiOperation({
    summary: '更新訂單狀態【管理員】',
    description: '管理員可更新訂單狀態（PENDING / PAID / SHIPPED / COMPLETED / CANCELLED）',
  })
  @ApiResponse({
    status: 200,
    description: '訂單狀態更新成功',
  })
  @ApiResponse({ status: 400, description: '請求體驗證失敗' })
  @ApiResponse({ status: 401, description: '未登入或 token 無效' })
  @ApiResponse({ status: 403, description: '僅管理員可執行此操作' })
  @ApiResponse({ status: 404, description: '訂單不存在' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, body.status);
  }
}
