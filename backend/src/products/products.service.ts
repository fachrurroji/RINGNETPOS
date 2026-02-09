import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        private prisma: PrismaService,
        private redis: RedisService,
    ) { }

    async create(tenantId: string, createProductDto: CreateProductDto) {
        return this.prisma.product.create({
            data: {
                ...createProductDto,
                tenantId,
            },
        });
    }

    async findAll(tenantId: string) {
        return this.prisma.product.findMany({
            where: { tenantId },
            orderBy: { name: 'asc' },
        });
    }

    async findOne(id: string, tenantId: string) {
        const product = await this.prisma.product.findFirst({
            where: { id, tenantId },
        });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    async findBySku(sku: string, tenantId: string) {
        // 1. Check Redis cache first
        const cached = await this.redis.getCachedProduct(tenantId, sku);
        if (cached) {
            return cached;
        }

        // 2. Query database on cache miss
        const product = await this.prisma.product.findFirst({
            where: { sku, tenantId },
        });
        if (!product) {
            throw new NotFoundException(`Product with SKU ${sku} not found`);
        }

        // 3. Cache the product for future requests
        await this.redis.cacheProduct(tenantId, sku, product);

        return product;
    }

    async update(id: string, tenantId: string, updateProductDto: UpdateProductDto) {
        const product = await this.findOne(id, tenantId);

        const updated = await this.prisma.product.update({
            where: { id },
            data: updateProductDto,
        });

        // Invalidate cache on update
        await this.redis.invalidateProduct(tenantId, product.sku);
        if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
            await this.redis.invalidateProduct(tenantId, updateProductDto.sku);
        }

        return updated;
    }

    async remove(id: string, tenantId: string) {
        const product = await this.findOne(id, tenantId);

        // Invalidate cache before delete
        await this.redis.invalidateProduct(tenantId, product.sku);

        return this.prisma.product.delete({
            where: { id },
        });
    }

    async search(query: string, tenantId: string) {
        return this.prisma.product.findMany({
            where: {
                tenantId,
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { sku: { contains: query, mode: 'insensitive' } },
                ],
            },
            take: 20,
        });
    }
}
