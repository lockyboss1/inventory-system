import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sku!: string;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty({ default: 10 })
  @IsInt()
  @Min(0)
  reorderThreshold!: number;

  @ApiProperty({ default: 0 })
  @IsInt()
  @Min(0)
  quantityInStock!: number;

  @ApiProperty()
  @IsInt()
  warehouseId!: number;

  @ApiProperty()
  @IsInt()
  supplierId!: number;
}
