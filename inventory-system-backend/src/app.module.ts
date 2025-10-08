import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from '././api/products/products.module';
import { PurchaseOrdersModule } from '././api/purchase-orders/purchase-orders.module';
import { Product } from './entities/product.entity';
import { Warehouse } from './entities/warehouse.entity';
import { Supplier } from './entities/supplier.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { SeederModule } from './seeder/seeder.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'inventory_db',
      entities: [Product, PurchaseOrder, Warehouse, Supplier],
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
    }),

    ProductsModule,
    PurchaseOrdersModule,
    SeederModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
