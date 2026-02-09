import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
    constructor(private prisma: PrismaService) { }

    async create(createTenantDto: CreateTenantDto) {
        return this.prisma.tenant.create({
            data: createTenantDto,
        });
    }

    async findAll() {
        return this.prisma.tenant.findMany({
            include: {
                _count: {
                    select: { users: true, branches: true, products: true },
                },
            },
        });
    }

    async findOne(id: string) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id },
            include: {
                branches: true,
                _count: {
                    select: { users: true, products: true },
                },
            },
        });
        if (!tenant) {
            throw new NotFoundException(`Tenant with ID ${id} not found`);
        }
        return tenant;
    }

    async update(id: string, updateTenantDto: UpdateTenantDto) {
        await this.findOne(id);
        return this.prisma.tenant.update({
            where: { id },
            data: updateTenantDto,
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.tenant.delete({
            where: { id },
        });
    }
}
