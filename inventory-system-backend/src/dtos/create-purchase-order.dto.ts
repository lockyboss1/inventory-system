import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreatePurchaseOrderDto {
  @ApiProperty()
  @IsInt()
  productId!: number;

  @ApiProperty()
  @IsInt()
  supplierId!: number;

  @ApiProperty()
  @IsInt()
  warehouseId!: number;

  @ApiProperty()
  @IsInt()
  quantityOrdered!: number;
}
