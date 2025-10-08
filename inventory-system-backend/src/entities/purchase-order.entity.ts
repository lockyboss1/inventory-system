import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { Supplier } from './supplier.entity';
import { Warehouse } from './warehouse.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('purchase_orders')
export class PurchaseOrder {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @ManyToOne(() => Product)
  product!: Product;

  @ApiProperty()
  @ManyToOne(() => Supplier)
  supplier!: Supplier;

  @ApiProperty()
  @ManyToOne(() => Warehouse)
  warehouse!: Warehouse;

  @ApiProperty()
  @Column()
  quantityOrdered!: number;

  @ApiProperty()
  @Column({ type: 'date' })
  orderDate!: Date;

  @ApiProperty()
  @Column({ type: 'date' })
  expectedArrivalDate!: Date;

  @ApiProperty()
  @Column({ default: 'pending' })
  status!: 'pending' | 'completed';
}
