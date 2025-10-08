import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { Warehouse } from '../../entities/warehouse.entity';
import { Supplier } from '../../entities/supplier.entity';
import { CreateProductDto } from '../../dtos/create-product.dto';
import { UpdateProductDto } from '../../dtos/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepo: Repository<Warehouse>,
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepo.find({
      relations: ['warehouse', 'supplier'],
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['warehouse', 'supplier'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const warehouse = await this.warehouseRepo.findOneBy({
      id: dto.warehouseId,
    });
    const supplier = await this.supplierRepo.findOneBy({ id: dto.supplierId });
    if (!warehouse || !supplier)
      throw new NotFoundException('Invalid warehouse or supplier');

    const product = this.productRepo.create({
      ...dto,
      warehouse,
      supplier,
    });
    return this.productRepo.save(product);
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.productRepo.save(product);
  }
}
