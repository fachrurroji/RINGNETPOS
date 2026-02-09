import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchesService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, createBranchDto: CreateBranchDto) {
        return this.prisma.branch.create({
            data: {
                ...createBranchDto,
                tenantId,
            },
        });
    }

    async findAll(tenantId: string) {
        return this.prisma.branch.findMany({
            where: { tenantId },
            include: {
                _count: {
                    select: { users: true, mechanics: true },
                },
            },
        });
    }

    async findOne(id: string, tenantId: string) {
        const branch = await this.prisma.branch.findFirst({
            where: { id, tenantId },
            include: {
                _count: {
                    select: { users: true, mechanics: true, inventory: true },
                },
            },
        });
        if (!branch) {
            throw new NotFoundException(`Branch with ID ${id} not found`);
        }
        return branch;
    }

    async update(id: string, tenantId: string, updateBranchDto: UpdateBranchDto) {
        await this.findOne(id, tenantId);
        return this.prisma.branch.update({
            where: { id },
            data: updateBranchDto,
        });
    }

    async remove(id: string, tenantId: string) {
        await this.findOne(id, tenantId);
        return this.prisma.branch.delete({
            where: { id },
        });
    }
}
