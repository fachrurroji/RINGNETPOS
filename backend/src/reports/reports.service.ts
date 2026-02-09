import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionStatus } from '@prisma/client';

@Injectable()
export class ReportsService {
    constructor(private prisma: PrismaService) { }

    // Daily revenue report
    async getDailyReport(tenantId: string, date: Date, branchId?: string) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const transactions = await this.prisma.transactionHeader.findMany({
            where: {
                tenantId,
                status: TransactionStatus.PAID,
                createdAt: { gte: startOfDay, lte: endOfDay },
                ...(branchId && { branchId }),
            },
            include: {
                branch: { select: { name: true } },
                details: {
                    include: {
                        product: { select: { name: true, type: true } },
                    },
                },
            },
        });

        const totalRevenue = transactions.reduce(
            (sum, t) => sum + Number(t.totalAmount),
            0,
        );
        const totalTransactions = transactions.length;
        const totalMechanicFee = transactions.reduce(
            (sum, t) =>
                sum + t.details.reduce((s, d) => s + Number(d.mechanicFee || 0), 0),
            0,
        );

        return {
            date: date.toISOString().split('T')[0],
            totalRevenue,
            totalTransactions,
            totalMechanicFee,
            netRevenue: totalRevenue - totalMechanicFee,
            transactions,
        };
    }

    // Mechanic commission report
    async getMechanicCommission(
        tenantId: string,
        startDate: Date,
        endDate: Date,
        branchId?: string,
    ) {
        const mechanics = await this.prisma.mechanic.findMany({
            where: {
                tenantId,
                ...(branchId && { branchId }),
            },
            include: {
                branch: { select: { name: true } },
            },
        });

        const commissionData = await Promise.all(
            mechanics.map(async (mechanic) => {
                const details = await this.prisma.transactionDetail.findMany({
                    where: {
                        mechanicId: mechanic.id,
                        transaction: {
                            tenantId,
                            status: TransactionStatus.PAID,
                            createdAt: { gte: startDate, lte: endDate },
                            ...(branchId && { branchId }),
                        },
                    },
                    include: {
                        transaction: { select: { createdAt: true } },
                    },
                });

                const totalCommission = details.reduce(
                    (sum, d) => sum + Number(d.mechanicFee || 0),
                    0,
                );
                const totalJobs = details.length;

                return {
                    mechanicId: mechanic.id,
                    mechanicName: mechanic.name,
                    branchName: mechanic.branch?.name || 'All Branches',
                    totalJobs,
                    totalCommission,
                };
            }),
        );

        // Filter out mechanics with no jobs
        const activeCommissions = commissionData.filter((c) => c.totalJobs > 0);

        return {
            period: {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
            },
            totalCommission: activeCommissions.reduce(
                (sum, c) => sum + c.totalCommission,
                0,
            ),
            totalJobs: activeCommissions.reduce((sum, c) => sum + c.totalJobs, 0),
            mechanics: activeCommissions.sort(
                (a, b) => b.totalCommission - a.totalCommission,
            ),
        };
    }

    // Top products report
    async getTopProducts(
        tenantId: string,
        startDate: Date,
        endDate: Date,
        branchId?: string,
        limit = 10,
    ) {
        const details = await this.prisma.transactionDetail.groupBy({
            by: ['productId'],
            where: {
                transaction: {
                    tenantId,
                    status: TransactionStatus.PAID,
                    createdAt: { gte: startDate, lte: endDate },
                    ...(branchId && { branchId }),
                },
            },
            _sum: { qty: true, subtotal: true },
            _count: { id: true },
            orderBy: { _sum: { qty: 'desc' } },
            take: limit,
        });

        const products = await Promise.all(
            details.map(async (d) => {
                const product = await this.prisma.product.findUnique({
                    where: { id: d.productId },
                    select: { name: true, sku: true, type: true },
                });
                return {
                    productId: d.productId,
                    productName: product?.name,
                    sku: product?.sku,
                    type: product?.type,
                    totalQty: d._sum.qty,
                    totalRevenue: d._sum.subtotal,
                    transactionCount: d._count.id,
                };
            }),
        );

        return {
            period: {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
            },
            products,
        };
    }

    // Vehicle service history
    async getVehicleHistory(tenantId: string, customerPlate: string) {
        const transactions = await this.prisma.transactionHeader.findMany({
            where: {
                tenantId,
                customerPlate: { equals: customerPlate, mode: 'insensitive' },
            },
            include: {
                branch: { select: { name: true } },
                details: {
                    include: {
                        product: { select: { name: true, type: true } },
                        mechanic: { select: { name: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return {
            customerPlate,
            totalVisits: transactions.length,
            totalSpent: transactions.reduce(
                (sum, t) => sum + Number(t.totalAmount),
                0,
            ),
            history: transactions.map((t) => ({
                id: t.id,
                date: t.createdAt,
                branch: t.branch?.name,
                total: t.totalAmount,
                status: t.status,
                items: t.details.map((d) => ({
                    product: d.product.name,
                    type: d.product.type,
                    qty: d.qty,
                    price: d.priceAtMoment,
                    mechanic: d.mechanic?.name,
                })),
            })),
        };
    }
}
