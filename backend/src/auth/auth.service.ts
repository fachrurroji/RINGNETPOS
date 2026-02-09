import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Update last login
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });

        return user;
    }

    async login(user: { id: string; username: string; role: string; tenantId: string | null; branchId: string | null }) {
        const payload = {
            sub: user.id,
            username: user.username,
            role: user.role,
            tenantId: user.tenantId,
            branchId: user.branchId,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                tenantId: user.tenantId,
                branchId: user.branchId,
            },
        };
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }
}
