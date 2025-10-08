import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrder } from '../../entities/purchase-order.entity';
import { Product } from '../../entities/product.entity';
import { Supplier } from '../../entities/supplier.entity';
import { Warehouse } from '../../entities/warehouse.entity';
import { PurchaseOrdersController } from './purchase-orders.controller';
import { PurchaseOrdersService } from './purchase-orders.service';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseOrder, Product, Supplier, Warehouse]),
    ProductsModule,
  ],
  controllers: [PurchaseOrdersController],
  providers: [PurchaseOrdersService],
})
export class PurchaseOrdersModule {}