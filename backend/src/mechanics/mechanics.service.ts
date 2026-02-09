import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMechanicDto, UpdateMechanicDto } from './dto/mechanic.dto';

@Injectable()
export class MechanicsService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, createMechanicDto: CreateMechanicDto) {
        return this.prisma.mechanic.create({
            data: {
                tenantId,
                ...createMechanicDto,
            },
            include: {
                branch: { select: { name: true } },
            },
        });
    }

    async findAll(tenantId: string, branchId?: string, activeOnly = true) {
        return this.prisma.mechanic.findMany({
            where: {
                tenantId,
                ...(branchId && { branchId }),
                ...(activeOnly && { isActive: true }),
            },
            include: {
                branch: { select: { name: true } },
            },
            orderBy: { name: 'asc' },
        });
    }

    async findOne(id: string, tenantId: string) {
        const mechanic = await this.prisma.mechanic.findFirst({
            where: { id, tenantId },
            include: {
                branch: { select: { name: true } },
            },
        });
        if (!mechanic) {
            throw new NotFoundException(`Mechanic ${id} not found`);
        }
        return mechanic;
    }

    async update(id: string, tenantId: string, updateMechanicDto: UpdateMechanicDto) {
        await this.findOne(id, tenantId);
        return this.prisma.mechanic.update({
            where: { id },
            data: updateMechanicDto,
            include: {
                branch: { select: { name: true } },
            },
        });
    }

    async remove(id: string, tenantId: string) {
        await this.findOne(id, tenantId);
        return this.prisma.mechanic.delete({
            where: { id },
        });
    }
}
