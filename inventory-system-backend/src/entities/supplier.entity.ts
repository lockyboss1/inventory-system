import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('suppliers')
export class Supplier {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column()
  name!: string;

  @ApiProperty()
  @Column()
  contactInfo!: string;

  @ApiProperty()
  @OneToMany(() => PurchaseOrder, (order) => order.supplier)
  purchaseOrders!: PurchaseOrder[];
}
