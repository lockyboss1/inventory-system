import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from '../../dtos/create-purchase-order.dto';
import { PurchaseOrder } from '../../entities/purchase-order.entity';

@ApiTags('purchase-orders')
@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrderService: PurchaseOrdersService) {}

  @Get()
  @ApiOperation({ summary: 'View all purchase orders' })
  findAll() {
    return this.purchaseOrderService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'View details of a single purchase order' })
  findOne(@Param('id') id: number) {
    return this.purchaseOrderService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new purchase order' })
  create(@Body() dto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    return this.purchaseOrderService.create(dto);
  }

  @Post(':id/complete')
  @ApiOperation({
    summary: 'Mark purchase order as completed and update stock',
  })
  async completeOrder(@Param('id') id: number) {
    return this.purchaseOrderService.markOrderAsCompleted(id);
  }
}
