import { Controller, Get, Param, Body, Post } from '@nestjs/common';
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

  @Post()
  @ApiOperation({ summary: 'Create new product' })
  create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productsService.create(dto);
  }
}
