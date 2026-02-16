import {
    Controller,
    Get,
    Post,
    Body,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('returns')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReturnsController {
    constructor(private readonly returnsService: ReturnsService) { }

    @Post()
    @Roles(UserRole.OWNER, UserRole.MANAGER)
    async create(@Request() req, @Body() createDto: CreateReturnDto) {
        return this.returnsService.create(
            req.user.userId,
            req.user.tenantId,
            createDto,
        );
    }

    @Get()
    @Roles(UserRole.OWNER, UserRole.MANAGER)
    async findAll(
        @Request() req,
        @Query('transactionId') transactionId?: string,
    ) {
        return this.returnsService.findAll(req.user.tenantId, transactionId);
    }

    @Get('by-transaction/:transactionId')
    @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER)
    async findByTransaction(
        @Request() req,
        @Query('transactionId') transactionId: string,
    ) {
        return this.returnsService.findByTransaction(
            transactionId,
            req.user.tenantId,
        );
    }
}
