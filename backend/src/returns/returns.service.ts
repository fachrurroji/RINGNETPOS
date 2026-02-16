import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReturnDto } from './dto/create-return.dto';

@Injectable()
export class ReturnsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, tenantId: string, dto: CreateReturnDto) {
        // Find transaction detail
        const transactionDetail = await this.prisma.transactionDetail.findFirst({
            where: {
                id: dto.transactionDetailId,
                transaction: { tenantId },
            },
            include: {
                transaction: { select: { branchId: true, status: true } },
                product: { select: { type: true, name: true, sku: true } },
                returns: true,
            },
        });

        if (!transactionDetail) {
            throw new NotFoundException('Transaction detail not found');
        }

        if (transactionDetail.transaction.status === 'CANCELLED') {
            throw new BadRequestException('Cannot return from cancelled transaction');
        }

        // Calculate total returned qty
        const totalReturned = transactionDetail.returns.reduce(
            (sum, r) => sum + r.qty,
            0,
        );
        const availableQty = transactionDetail.qty - totalReturned;

        if (dto.qty > availableQty) {
            throw new BadRequestException(
                `Cannot return ${dto.qty} items. Only ${availableQty} available for return`,
            );
        }

        // Perform return in transaction
        return this.prisma.$transaction(async (tx) => {
            // Create return record
            const returnRecord = await tx.transactionReturn.create({
                data: {
                    transactionDetailId: dto.transactionDetailId,
                    qty: dto.qty,
                    reason: dto.reason,
                    notes: dto.notes,
                    returnedBy: userId,
                },
                include: {
                    transactionDetail: {
                        include: {
                            product: { select: { sku: true, name: true } },
                            transaction: {
                                select: {
                                    id: true,
                                    customerPlate: true,
                                    branch: { select: { name: true } },
                                },
                            },
                        },
                    },
                    user: { select: { username: true } },
                },
            });

            // If product type is GOODS, restore stock
            if (transactionDetail.product.type === 'GOODS') {
                const inventory = await tx.inventory.findFirst({
                    where: {
                        branchId: transactionDetail.transaction.branchId,
                        productId: transactionDetail.productId,
                        tenantId,
                    },
                });

                if (inventory) {
                    await tx.inventory.update({
                        where: { id: inventory.id },
                        data: { qty: { increment: dto.qty } },
                    });
                }
            }

            return returnRecord;
        });
    }

    async findAll(tenantId: string, transactionId?: string) {
        return this.prisma.transactionReturn.findMany({
            where: {
                transactionDetail: {
                    transaction: {
                        tenantId,
                        ...(transactionId && { id: transactionId }),
                    },
                },
            },
            include: {
                transactionDetail: {
                    include: {
                        product: { select: { sku: true, name: true } },
                        transaction: {
                            select: {
                                id: true,
                                customerPlate: true,
                                branch: { select: { name: true } },
                            },
                        },
                    },
                },
                user: { select: { username: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findByTransaction(transactionId: string, tenantId: string) {
        // Verify transaction belongs to tenant
        const transaction = await this.prisma.transactionHeader.findFirst({
            where: { id: transactionId, tenantId },
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        return this.prisma.transactionReturn.findMany({
            where: {
                transactionDetail: {
                    transactionId,
                },
            },
            include: {
                transactionDetail: {
                    include: {
                        product: { select: { sku: true, name: true } },
                    },
                },
                user: { select: { username: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}
