import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { Supplier } from './supplier.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('products')
export class Product {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column()
  sku!: string;

  @ApiProperty()
  @Column()
  name!: string;

  @ApiProperty()
  @Column()
  description!: string;

  @ApiProperty()
  @Column({ default: 10 })
  reorderThreshold!: number;

  @ApiProperty()
  @Column({ default: 0 })
  quantityInStock!: number;

  @ApiProperty()
  @ManyToOne(() => Warehouse, (warehouse) => warehouse.products)
  warehouse!: Warehouse;

  @ApiProperty()
  @ManyToOne(() => Supplier)
  supplier!: Supplier;
}
