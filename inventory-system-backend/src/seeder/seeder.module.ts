import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Warehouse } from '../entities/warehouse.entity';
import { Supplier } from '../entities/supplier.entity';
import { Product } from '../entities/product.entity';
import { PurchaseOrder } from '../entities/purchase-order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Warehouse, Supplier, Product, PurchaseOrder]),
  ],
  providers: [SeederService],
})
export class SeederModule {}
