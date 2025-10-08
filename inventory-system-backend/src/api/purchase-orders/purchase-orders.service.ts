import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from '../../entities/purchase-order.entity';
import { Product } from '../../entities/product.entity';
import { Supplier } from '../../entities/supplier.entity';
import { Warehouse } from '../../entities/warehouse.entity';
import { CreatePurchaseOrderDto } from '../../dtos/create-purchase-order.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PurchaseOrdersService {
  private readonly logger = new Logger(PurchaseOrdersService.name);

  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepo: Repository<PurchaseOrder>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepo: Repository<Warehouse>,
  ) {}

  async findAll(): Promise<PurchaseOrder[]> {
    return this.purchaseOrderRepo.find({
      relations: ['product', 'supplier', 'warehouse'],
    });
  }

  async findOne(id: number): Promise<PurchaseOrder> {
    const order = await this.purchaseOrderRepo.findOne({
      where: { id },
      relations: ['product', 'supplier', 'warehouse'],
    });
    if (!order) throw new NotFoundException('Purchase order not found');
    return order;
  }

  async create(dto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    const product = await this.productRepo.findOne({
      where: { id: dto.productId },
      relations: ['warehouse', 'supplier'],
    });

    const supplier = await this.supplierRepo.findOneBy({ id: dto.supplierId });
    const warehouse = await this.warehouseRepo.findOneBy({
      id: dto.warehouseId,
    });

    if (!product || !supplier || !warehouse)
      throw new NotFoundException('Invalid product, supplier, or warehouse');

    // Check warehouse capacity
    const warehouseUsage = await this.calculateWarehouseUsage(warehouse.id);
    const remainingCapacity = warehouse.capacity - warehouseUsage;

    if (remainingCapacity <= 0) {
      throw new BadRequestException(
        `Warehouse ${warehouse.name} has no remaining capacity.`,
      );
    }

    // Validate requested order amount
    if (dto.quantityOrdered > product.quantityInStock) {
      throw new BadRequestException(
        `Cannot order ${dto.quantityOrdered} units of ${product.name}. There are only ${product.quantityInStock} in stock.`,
      );
    }

    // Validate against warehouse remaining capacity
    if (dto.quantityOrdered > remainingCapacity) {
      throw new BadRequestException(
        `Warehouse ${warehouse.name} cannot hold ${dto.quantityOrdered} more units. Remaining capacity: ${remainingCapacity}.`,
      );
    }

    // Set order and expected arrival dates
    const orderDate = new Date();
    const expectedArrivalDate = new Date(orderDate);
    expectedArrivalDate.setDate(orderDate.getDate() + 3);

    // Update stock
    product.quantityInStock -= dto.quantityOrdered;

    await this.productRepo.save(product);

    const order = this.purchaseOrderRepo.create({
      product,
      supplier,
      warehouse,
      quantityOrdered: dto.quantityOrdered,
      orderDate,
      expectedArrivalDate,
      status: 'pending',
    });

    this.logger.log(
      `Created order for ${dto.quantityOrdered} units of ${product.name}. 
     Stock before order: ${product.quantityInStock}. 
     Expected arrival: ${expectedArrivalDate.toDateString()}`,
    );

    return this.purchaseOrderRepo.save(order);
  }

  async markAsReceived(orderId: number): Promise<PurchaseOrder> {
    const order = await this.purchaseOrderRepo.findOne({
      where: { id: orderId },
      relations: ['product'],
    });
    if (!order) throw new NotFoundException('Order not found');

    order.status = 'completed';
    order.product.quantityInStock += order.quantityOrdered;

    await this.purchaseOrderRepo.save(order);
    await this.productRepo.save(order.product);

    return order;
  }

  /**
   * Automatically checks all products for reorder needs.
   * Runs on schedule or manual trigger.
   */
  async checkAndReorderLowStock() {
    this.logger.log('Checking products for low stock...');

    const lowStockProducts = await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.warehouse', 'warehouse')
      .leftJoinAndSelect('product.supplier', 'supplier')
      .where('product."quantityInStock" < product."reorderThreshold"')
      .getMany();

    if (lowStockProducts.length === 0) {
      this.logger.log('No products need reordering.');
      return [];
    }

    const createdOrders: PurchaseOrder[] = [];

    for (const product of lowStockProducts) {
      this.logger.warn(
        `Product ${product.name} is below threshold (${product.quantityInStock}/${product.reorderThreshold})`,
      );

      const order = await this.createAutoPurchaseOrder(product);
      if (order) createdOrders.push(order);
    }

    this.logger.log(
      `Created ${createdOrders.length} automatic purchase orders.`,
    );
    return createdOrders;
  }

  /**
   * Automatically generates a purchase order for a low-stock product.
   */
  private async createAutoPurchaseOrder(product: Product) {
    const warehouse = product.warehouse;
    const supplier = product.supplier;

    if (!supplier) {
      this.logger.error(`No supplier assigned for product ${product.name}`);
      return null;
    }

    // Calculate suggested reorder quantity (up to threshold * 2)
    const reorderQuantity =
      product.reorderThreshold * 2 - product.quantityInStock;

    // Check available capacity
    const warehouseUsage = await this.calculateWarehouseUsage(warehouse.id);
    const remainingCapacity = warehouse.capacity - warehouseUsage;

    if (remainingCapacity <= 0) {
      this.logger.error(`Warehouse ${warehouse.name} is at full capacity.`);
      return null;
    }

    const finalQuantity =
      reorderQuantity > remainingCapacity ? remainingCapacity : reorderQuantity;

    if (finalQuantity <= 0) {
      this.logger.warn(`Not enough capacity to reorder ${product.name}`);
      return null;
    }

    const today = new Date();
    const leadTimeDays = 3;
    const expectedArrival = new Date(today);
    expectedArrival.setDate(today.getDate() + leadTimeDays);

    const newOrder = this.purchaseOrderRepo.create({
      product,
      supplier,
      warehouse,
      quantityOrdered: finalQuantity,
      orderDate: today,
      expectedArrivalDate: expectedArrival,
      status: 'pending',
    });

    this.logger.log(
      `Auto-ordering ${finalQuantity} units of ${product.name} (Expected ${expectedArrival.toDateString()})`,
    );
    return this.purchaseOrderRepo.save(newOrder);
  }

  /**
   * Checks total stock levels across all products in a warehouse.
   */
  private async calculateWarehouseUsage(warehouseId: number): Promise<number> {
    const products = await this.productRepo.find({
      where: { warehouse: { id: warehouseId } },
    });

    return products.reduce((sum, p) => sum + p.quantityInStock, 0);
  }

  /**
   * Updates stock when a purchase order arrives.
   */
  async markOrderAsCompleted(orderId: number) {
    const order = await this.purchaseOrderRepo.findOne({
      where: { id: orderId },
      relations: ['product', 'warehouse'],
    });

    if (!order) throw new BadRequestException('Purchase order not found.');
    if (order.status === 'completed')
      throw new BadRequestException('Order already completed.');

    const product = order.product;
    product.quantityInStock += order.quantityOrdered;
    order.status = 'completed';

    await this.productRepo.save(product);
    await this.purchaseOrderRepo.save(order);

    this.logger.log(
      `Updated stock for ${product.name}: ${product.quantityInStock}`,
    );
    return order;
  }

  @Cron('0 0 * * *')
  async handleCron() {
    await this.checkAndReorderLowStock();
  }
}
