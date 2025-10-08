import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Patch,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from '../../dtos/create-product.dto';
import { Product } from '../../entities/product.entity';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List all products with stock levels' })
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Patch(':id/adjust')
  async adjustStock(@Param('id') id: number, @Body() body: { amount: number }) {
    const product = await this.productsService.findOne(id);
    if (!product) throw new NotFoundException('Product not found.');

    const newStock = product.quantityInStock + body.amount;
    if (newStock < 0)
      throw new BadRequestException('Insufficient stock to reduce that much.');

    return this.productsService.updateStock(id, newStock);
  }

  @Post()
  @ApiOperation({ summary: 'Create new product' })
  create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productsService.create(dto);
  }
}
