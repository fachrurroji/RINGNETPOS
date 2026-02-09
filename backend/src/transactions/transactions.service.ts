import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto, UpdateTransactionStatusDto } from './dto/create-transaction.dto';
import { TransactionStatus, ProductType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class TransactionsService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, userId: string, createTransactionDto: CreateTransactionDto) {
        const { branchId, customerPlate, items } = createTransactionDto;

        // Validate products and calculate totals
        let totalAmount = new Decimal(0);
        const validatedItems: any[] = [];

        for (const item of items) {
            const product = await this.prisma.product.findFirst({
                where: { id: item.productId, tenantId },
            });

            if (!product) {
                throw new NotFoundException(`Product ${item.productId} not found`);
            }

            const subtotal = new Decimal(item.priceAtMoment).times(item.qty);
            totalAmount = totalAmount.plus(subtotal);

            // Check stock for GOODS
            if (product.type === ProductType.GOODS) {
                const inventory = await this.prisma.inventory.findFirst({
                    where: { tenantId, branchId, productId: item.productId },
                });

                if (!inventory || inventory.qty < item.qty) {
                    throw new BadRequestException(
                        `Insufficient stock for ${product.name}. Available: ${inventory?.qty || 0}`,
                    );
                }
            }

            validatedItems.push({
                productId: item.productId,
                qty: item.qty,
                priceAtMoment: item.priceAtMoment,
                subtotal: subtotal.toNumber(),
                mechanicId: item.mechanicId || null,
                mechanicFee: item.mechanicFee || null,
            });
        }

        // Create transaction in a single database transaction
        const transaction = await this.prisma.$transaction(async (tx) => {
            // Create header
            const header = await tx.transactionHeader.create({
                data: {
                    tenantId,
                    branchId,
                    customerPlate,
                    totalAmount: totalAmount.toNumber(),
                    status: TransactionStatus.PENDING,
                },
            });

            // Create details
            await tx.transactionDetail.createMany({
                data: validatedItems.map((item) => ({
                    transactionId: header.id,
                    ...item,
                })),
            });

            // Reduce inventory for GOODS
            for (const item of items) {
                const product = await tx.product.findUnique({ where: { id: item.productId } });
                if (product?.type === ProductType.GOODS) {
                    await tx.inventory.updateMany({
                        where: { tenantId, branchId, productId: item.productId },
                        data: { qty: { decrement: item.qty } },
                    });
                }
            }

            return header;
        });

        // Return full transaction with details
        return this.findOne(transaction.id, tenantId);
    }

    async findAll(tenantId: string, branchId?: string, status?: TransactionStatus) {
        return this.prisma.transactionHeader.findMany({
            where: {
                tenantId,
                ...(branchId && { branchId }),
                ...(status && { status }),
            },
            include: {
                branch: { select: { name: true } },
                _count: { select: { details: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }

    async findOne(id: string, tenantId: string) {
        const transaction = await this.prisma.transactionHeader.findFirst({
            where: { id, tenantId },
            include: {
                branch: { select: { name: true } },
                details: {
                    include: {
                        product: { select: { name: true, sku: true, type: true } },
                        mechanic: { select: { name: true } },
                    },
                },
            },
        });

        if (!transaction) {
            throw new NotFoundException(`Transaction ${id} not found`);
        }

        return transaction;
    }

    async updateStatus(id: string, tenantId: string, updateDto: UpdateTransactionStatusDto) {
        const transaction = await this.findOne(id, tenantId);

        // If cancelling, restore inventory
        if (updateDto.status === TransactionStatus.CANCELLED && transaction.status !== TransactionStatus.CANCELLED) {
            await this.prisma.$transaction(async (tx) => {
                for (const detail of transaction.details) {
                    if (detail.product.type === ProductType.GOODS) {
                        await tx.inventory.updateMany({
                            where: { tenantId, branchId: transaction.branchId, productId: detail.productId },
                            data: { qty: { increment: detail.qty } },
                        });
                    }
                }
            });
        }

        return this.prisma.transactionHeader.update({
            where: { id },
            data: { status: updateDto.status },
        });
    }
}
