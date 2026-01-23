import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderStatus } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  async create(@Req() req, @Body() body: {
    items: { productId: number; quantity: number }[];
    shippingAddress: string;
    receiverName: string;
    receiverPhone: string;
  }) {
    // userId from auth req.user
    // const userId = req.user.userId;
    // Mock user ID for now until Auth is fully integrated
    const userId = 1;
    return this.ordersService.create(userId, body);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my orders' })
  async findMyOrders(@Req() req) {
    // const userId = req.user.userId;
    const userId = 1;
    return this.ordersService.findMyOrders(userId);
  }

  @Get()
  @ApiOperation({ summary: 'Admin: Get all orders' })
  async findAll() {
    return this.ordersService.findAll();
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Admin: Update order status' })
  async updateStatus(@Param('id') id: string, @Body() body: { status: OrderStatus }) {
    return this.ordersService.updateStatus(+id, body.status);
  }
}
