import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryDto, AdjustInventoryDto } from './dto/inventory.dto';

@Injectable()
export class InventoryService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, createInventoryDto: CreateInventoryDto) {
        return this.prisma.inventory.create({
            data: {
                tenantId,
                ...createInventoryDto,
            },
            include: {
                product: { select: { name: true, sku: true } },
                branch: { select: { name: true } },
            },
        });
    }

    async findAll(tenantId: string, branchId?: string) {
        return this.prisma.inventory.findMany({
            where: {
                tenantId,
                ...(branchId && { branchId }),
            },
            include: {
                product: { select: { name: true, sku: true, type: true } },
                branch: { select: { name: true } },
            },
            orderBy: { product: { name: 'asc' } },
        });
    }

    async findLowStock(tenantId: string, branchId?: string) {
        return this.prisma.inventory.findMany({
            where: {
                tenantId,
                ...(branchId && { branchId }),
                qty: { lte: this.prisma.inventory.fields.minStockAlert },
            },
            include: {
                product: { select: { name: true, sku: true } },
                branch: { select: { name: true } },
            },
        });
    }

    async findOne(id: string, tenantId: string) {
        const inventory = await this.prisma.inventory.findFirst({
            where: { id, tenantId },
            include: {
                product: { select: { name: true, sku: true } },
                branch: { select: { name: true } },
            },
        });
        if (!inventory) {
            throw new NotFoundException(`Inventory ${id} not found`);
        }
        return inventory;
    }

    async adjust(id: string, tenantId: string, adjustDto: AdjustInventoryDto) {
        await this.findOne(id, tenantId);

        if (adjustDto.isAdjustment) {
            // Increment/decrement
            return this.prisma.inventory.update({
                where: { id },
                data: { qty: { increment: adjustDto.qty } },
                include: {
                    product: { select: { name: true, sku: true } },
                    branch: { select: { name: true } },
                },
            });
        } else {
            // Set absolute value
            return this.prisma.inventory.update({
                where: { id },
                data: { qty: adjustDto.qty },
                include: {
                    product: { select: { name: true, sku: true } },
                    branch: { select: { name: true } },
                },
            });
        }
    }

    async getByProductAndBranch(tenantId: string, branchId: string, productId: string) {
        return this.prisma.inventory.findFirst({
            where: { tenantId, branchId, productId },
        });
    }
}
