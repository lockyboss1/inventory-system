import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { Warehouse } from '../../entities/warehouse.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Supplier } from 'entities/supplier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Warehouse, Supplier])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
