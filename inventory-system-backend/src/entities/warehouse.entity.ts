import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('warehouses')
export class Warehouse {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column()
  name!: string;

  @ApiProperty()
  @Column()
  location!: string;

  @ApiProperty()
  @Column()
  capacity!: number;

  @ApiProperty()
  @OneToMany(() => PurchaseOrder, (order) => order.warehouse)
  purchaseOrders!: PurchaseOrder[];

  @ApiProperty()
  @OneToMany(() => Product, (product) => product.warehouse)
  products!: Product[];
}
