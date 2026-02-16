import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStockTransferDto } from './dto/create-stock-transfer.dto';

@Injectable()
export class StockTransferService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, tenantId: string, dto: CreateStockTransferDto) {
        // Validate branches exist and belong to tenant
        const [fromBranch, toBranch] = await Promise.all([
            this.prisma.branch.findFirst({
                where: { id: dto.fromBranchId, tenantId },
            }),
            this.prisma.branch.findFirst({
                where: { id: dto.toBranchId, tenantId },
            }),
        ]);

        if (!fromBranch || !toBranch) {
            throw new NotFoundException('Branch not found');
        }

        if (dto.fromBranchId === dto.toBranchId) {
            throw new BadRequestException('Cannot transfer to the same branch');
        }

        // Validate product exists
        const product = await this.prisma.product.findFirst({
            where: { id: dto.productId, tenantId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (product.type !== 'GOODS') {
            throw new BadRequestException('Can only transfer goods, not services');
        }

        // Check source branch has enough stock
        const sourceInventory = await this.prisma.inventory.findFirst({
            where: {
                branchId: dto.fromBranchId,
                productId: dto.productId,
                tenantId,
            },
        });

        if (!sourceInventory || sourceInventory.qty < dto.qty) {
            throw new BadRequestException('Insufficient stock in source branch');
        }

        // Perform transfer in transaction
        return this.prisma.$transaction(async (tx) => {
            // Decrement source
            await tx.inventory.update({
                where: { id: sourceInventory.id },
                data: { qty: { decrement: dto.qty } },
            });

            // Increment or create destination inventory
            const destInventory = await tx.inventory.findFirst({
                where: {
                    branchId: dto.toBranchId,
                    productId: dto.productId,
                    tenantId,
                },
            });

            if (destInventory) {
                await tx.inventory.update({
                    where: { id: destInventory.id },
                    data: { qty: { increment: dto.qty } },
                });
            } else {
                await tx.inventory.create({
                    data: {
                        tenantId,
                        branchId: dto.toBranchId,
                        productId: dto.productId,
                        qty: dto.qty,
                        minStockAlert: product.minStock,
                    },
                });
            }

            // Log transfer
            const transfer = await tx.stockTransfer.create({
                data: {
                    tenantId,
                    productId: dto.productId,
                    fromBranchId: dto.fromBranchId,
                    toBranchId: dto.toBranchId,
                    qty: dto.qty,
                    transferredBy: userId,
                    notes: dto.notes,
                },
                include: {
                    product: { select: { sku: true, name: true } },
                    fromBranch: { select: { name: true } },
                    toBranch: { select: { name: true } },
                    user: { select: { username: true } },
                },
            });

            return transfer;
        });
    }

    async findAll(tenantId: string, branchId?: string, productId?: string) {
        return this.prisma.stockTransfer.findMany({
            where: {
                tenantId,
                ...(branchId && {
                    OR: [{ fromBranchId: branchId }, { toBranchId: branchId }],
                }),
                ...(productId && { productId }),
            },
            include: {
                product: { select: { sku: true, name: true } },
                fromBranch: { select: { name: true } },
                toBranch: { select: { name: true } },
                user: { select: { username: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, tenantId: string) {
        const transfer = await this.prisma.stockTransfer.findFirst({
            where: { id, tenantId },
            include: {
                product: { select: { sku: true, name: true } },
                fromBranch: { select: { name: true } },
                toBranch: { select: { name: true } },
                user: { select: { username: true } },
            },
        });

        if (!transfer) {
            throw new NotFoundException('Transfer not found');
        }

        return transfer;
    }
}
