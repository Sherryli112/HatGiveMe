import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Order, OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) { }

  async create(userId: number, data: {
    items: { productId: number; quantity: number }[];
    shippingAddress: string;
    receiverName: string;
    receiverPhone: string;
  }): Promise<Order> {
    const { items, ...orderData } = data;

    // Calculate total amount and verify stock (simplified for now, ideally strictly check stock)
    let totalAmount = 0;
    const orderItemsData: Prisma.OrderItemCreateWithoutOrderInput[] = [];

    // Fetch product prices to calculate total
    for (const item of items) {
      const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new Error(`Product ${item.productId} not found`);
      if (product.stock < item.quantity) throw new Error(`Product ${product.name} out of stock`);

      const itemTotal = Number(product.price) * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        product: { connect: { id: item.productId } },
        quantity: item.quantity,
        price: product.price
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
          create: orderItemsData
        }
      },
      include: {
        items: true
      }
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
    return this.prisma.order.update({
      where: { id },
      data: { status }
    });
  }
}
