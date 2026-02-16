import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDraftDto, UpdateDraftDto } from './dto/draft-transaction.dto';

@Injectable()
export class DraftTransactionsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, tenantId: string, branchId: string, dto: CreateDraftDto) {
        return this.prisma.draftTransaction.create({
            data: {
                tenantId,
                branchId,
                customerPlate: dto.customerPlate,
                totalAmount: dto.totalAmount,
                draftData: JSON.stringify(dto.items),
                createdBy: userId,
            },
        });
    }

    async findAll(tenantId: string, branchId?: string, userId?: string) {
        return this.prisma.draftTransaction.findMany({
            where: {
                tenantId,
                ...(branchId && { branchId }),
                ...(userId && { createdBy: userId }),
            },
            include: {
                branch: { select: { name: true } },
                user: { select: { username: true } },
            },
            orderBy: { updatedAt: 'desc' },
        });
    }

    async findOne(id: string, tenantId: string) {
        const draft = await this.prisma.draftTransaction.findFirst({
            where: { id, tenantId },
            include: {
                branch: { select: { name: true } },
                user: { select: { username: true } },
            },
        });

        if (!draft) {
            throw new NotFoundException('Draft not found');
        }

        // Parse draft data back to JSON
        return {
            ...draft,
            items: JSON.parse(draft.draftData),
        };
    }

    async update(id: string, tenantId: string, dto: UpdateDraftDto) {
        const draft = await this.prisma.draftTransaction.findFirst({
            where: { id, tenantId },
        });

        if (!draft) {
            throw new NotFoundException('Draft not found');
        }

        return this.prisma.draftTransaction.update({
            where: { id },
            data: {
                customerPlate: dto.customerPlate,
                totalAmount: dto.totalAmount,
                draftData: JSON.stringify(dto.items),
            },
        });
    }

    async remove(id: string, tenantId: string) {
        const draft = await this.prisma.draftTransaction.findFirst({
            where: { id, tenantId },
        });

        if (!draft) {
            throw new NotFoundException('Draft not found');
        }

        return this.prisma.draftTransaction.delete({ where: { id } });
    }

    // Convert draft to real transaction
    async convertToTransaction(id: string, tenantId: string) {
        const draft = await this.findOne(id, tenantId);
        const items = JSON.parse(draft.draftData);

        // Create transaction in atomic operation
        return this.prisma.$transaction(async (tx) => {
            // Create transaction header
            const transaction = await tx.transactionHeader.create({
                data: {
                    tenantId,
                    branchId: draft.branchId,
                    customerPlate: draft.customerPlate,
                    totalAmount: draft.totalAmount,
                    status: 'PAID',
                },
            });

            // Create transaction details
            await Promise.all(
                items.map((item: any) =>
                    tx.transactionDetail.create({
                        data: {
                            transactionId: transaction.id,
                            productId: item.productId,
                            mechanicId: item.mechanicId || null,
                            qty: item.qty,
                            priceAtMoment: item.priceAtMoment,
                            mechanicFee: item.mechanicFee || null,
                            subtotal: item.subtotal,
                        },
                    })
                )
            );

            // Update inventory (decrement stock for GOODS)
            for (const item of items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId },
                });

                if (product && product.type === 'GOODS') {
                    const inventory = await tx.inventory.findFirst({
                        where: {
                            branchId: draft.branchId,
                            productId: item.productId,
                            tenantId,
                        },
                    });

                    if (inventory) {
                        await tx.inventory.update({
                            where: { id: inventory.id },
                            data: { qty: { decrement: item.qty } },
                        });
                    }
                }
            }

            // Delete draft
            await tx.draftTransaction.delete({ where: { id } });

            return transaction;
        });
    }
}
