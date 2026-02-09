import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

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
        const product = await this.prisma.product.findFirst({
            where: { sku, tenantId },
        });
        if (!product) {
            throw new NotFoundException(`Product with SKU ${sku} not found`);
        }
        return product;
    }

    async update(id: string, tenantId: string, updateProductDto: UpdateProductDto) {
        await this.findOne(id, tenantId);
        return this.prisma.product.update({
            where: { id },
            data: updateProductDto,
        });
    }

    async remove(id: string, tenantId: string) {
        await this.findOne(id, tenantId);
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
