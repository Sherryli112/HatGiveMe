import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Order, OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) { }

  async create(
    userId: number,
    data: {
      items: { productId: number; quantity: number }[];
      shippingAddress: string;
      receiverName: string;
      receiverPhone: string;
    },
  ): Promise<Order> {
    const { items, ...orderData } = data;

    let totalAmount = 0;
    const orderItemsData: Prisma.OrderItemCreateWithoutOrderInput[] = [];

    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) {
        throw new NotFoundException(`商品 ID ${item.productId} 不存在`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(`商品「${product.name}」庫存不足`);
      }

      const itemTotal = Number(product.price) * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        product: { connect: { id: item.productId } },
        quantity: item.quantity,
        price: product.price,
      });
    }

    return this.prisma.order.create({
      data: {
        userId,
        totalAmount: new Prisma.Decimal(totalAmount),
        shippingAddress: orderData.shippingAddress,
        receiverName: orderData.receiverName,
        receiverPhone: orderData.receiverPhone,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });
  }

  // Admin: Find all orders
  async findAll() {
    return this.prisma.order.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  // User: Find my orders
  async findMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, user: true }
    });
  }

  async updateStatus(id: number, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('訂單不存在');
    }
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }
}
