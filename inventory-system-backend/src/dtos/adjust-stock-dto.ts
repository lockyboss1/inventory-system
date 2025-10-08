import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AdjustStockDto {
  @ApiProperty()
  @IsInt()
  amount!: number;
}
