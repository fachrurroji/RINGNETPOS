import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(createUserDto: CreateUserDto) {
        // Check if username exists
        const existing = await this.prisma.user.findUnique({
            where: { username: createUserDto.username },
        });
        if (existing) {
            throw new ConflictException('Username already exists');
        }

        const passwordHash = await bcrypt.hash(createUserDto.password, 10);
        const { password, ...rest } = createUserDto;

        return this.prisma.user.create({
            data: {
                ...rest,
                passwordHash,
            },
            select: {
                id: true,
                username: true,
                role: true,
                tenantId: true,
                branchId: true,
                createdAt: true,
            },
        });
    }

    async findAll(tenantId?: string) {
        return this.prisma.user.findMany({
            where: tenantId ? { tenantId } : undefined,
            select: {
                id: true,
                username: true,
                role: true,
                tenantId: true,
                branchId: true,
                lastLogin: true,
                createdAt: true,
                tenant: { select: { businessName: true } },
                branch: { select: { name: true } },
            },
        });
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                role: true,
                tenantId: true,
                branchId: true,
                lastLogin: true,
                createdAt: true,
                tenant: { select: { businessName: true } },
                branch: { select: { name: true } },
            },
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        await this.findOne(id);

        const data: any = { ...updateUserDto };
        if (updateUserDto.password) {
            data.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
            delete data.password;
        }

        return this.prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                username: true,
                role: true,
                tenantId: true,
                branchId: true,
                createdAt: true,
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.user.delete({
            where: { id },
        });
    }
}
