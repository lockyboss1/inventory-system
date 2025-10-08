import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from '../entities/warehouse.entity';
import { Supplier } from '../entities/supplier.entity';
import { Product } from '../entities/product.entity';
import { PurchaseOrder } from '../entities/purchase-order.entity';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepo: Repository<Warehouse>,
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(PurchaseOrder)
    private readonly orderRepo: Repository<PurchaseOrder>,
  ) {}

  async runSeed() {
    this.logger.log('Starting database seeding...');

    const warehouses = await this.seedWarehouses();
    const suppliers = await this.seedSuppliers();
    const products = await this.seedProducts(warehouses, suppliers);
    await this.seedPurchaseOrders(products, suppliers, warehouses);

    this.logger.log('Database seeding complete.');
  }

  private async seedWarehouses() {
    const existing = await this.warehouseRepo.count();
    if (existing > 0) return this.warehouseRepo.find();

    const data = [
      { name: 'Main Warehouse', location: 'Lagos', capacity: 5000 },
      { name: 'Backup Warehouse', location: 'Abuja', capacity: 2000 },
    ];

    const warehouses = this.warehouseRepo.create(data);
    return this.warehouseRepo.save(warehouses);
  }

  private async seedSuppliers() {
    const existing = await this.supplierRepo.count();
    if (existing > 0) return this.supplierRepo.find();

    const data = [
      { name: 'Global Med Supplies', contactInfo: 'globalmed@example.com' },
      { name: 'Pharma Plus', contactInfo: 'pharmaplus@example.com' },
    ];

    const suppliers = this.supplierRepo.create(data);
    return this.supplierRepo.save(suppliers);
  }

  private async seedProducts(warehouses: Warehouse[], suppliers: Supplier[]) {
    const existing = await this.productRepo.count();
    if (existing > 0) return this.productRepo.find();

    const data = [
      {
        sku: 'SKU-001',
        name: 'Surgical Gloves',
        description: 'High-quality latex gloves',
        reorderThreshold: 20,
        quantityInStock: 100,
        warehouse: warehouses[0],
        supplier: suppliers[0],
      },
      {
        sku: 'SKU-002',
        name: 'Face Masks',
        description: 'Disposable 3-layer masks',
        reorderThreshold: 50,
        quantityInStock: 500,
        warehouse: warehouses[1],
        supplier: suppliers[1],
      },
    ];

    const products = this.productRepo.create(data);
    return this.productRepo.save(products);
  }

  private async seedPurchaseOrders(
    products: Product[],
    suppliers: Supplier[],
    warehouses: Warehouse[],
  ) {
    const existing = await this.orderRepo.count();
    if (existing > 0) return;

    const data = [
      {
        product: products[0],
        supplier: suppliers[0],
        warehouse: warehouses[0],
        quantityOrdered: 200,
        orderDate: new Date('2025-10-01'),
        expectedArrivalDate: new Date('2025-10-10'),
        status: 'pending' as const,
      },
      {
        product: products[1],
        supplier: suppliers[1],
        warehouse: warehouses[1],
        quantityOrdered: 1000,
        orderDate: new Date('2025-09-28'),
        expectedArrivalDate: new Date('2025-10-08'),
        status: 'completed' as const,
      },
    ];

    const orders = this.orderRepo.create(data);
    await this.orderRepo.save(orders);
  }

  async isDatabaseSeeded(): Promise<boolean> {
    const warehouseCount = await this.warehouseRepo.count();
    const productCount = await this.productRepo.count();
    return warehouseCount > 0 && productCount > 0;
  }
}
