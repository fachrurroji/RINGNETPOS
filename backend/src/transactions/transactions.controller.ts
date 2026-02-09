import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, UpdateTransactionStatusDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, TransactionStatus } from '@prisma/client';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Post()
    @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER)
    @ApiOperation({ summary: 'Create a new transaction' })
    create(@Body() createTransactionDto: CreateTransactionDto, @Request() req) {
        return this.transactionsService.create(req.user.tenantId, req.user.userId, createTransactionDto);
    }

    @Get()
    @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER)
    @ApiOperation({ summary: 'List transactions' })
    @ApiQuery({ name: 'branchId', required: false })
    @ApiQuery({ name: 'status', required: false, enum: TransactionStatus })
    findAll(
        @Request() req,
        @Query('branchId') branchId?: string,
        @Query('status') status?: TransactionStatus,
    ) {
        // Cashiers only see their branch transactions
        const effectiveBranchId = req.user.role === UserRole.CASHIER ? req.user.branchId : branchId;
        return this.transactionsService.findAll(req.user.tenantId, effectiveBranchId, status);
    }

    @Get(':id')
    @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER)
    @ApiOperation({ summary: 'Get transaction detail' })
    findOne(@Param('id') id: string, @Request() req) {
        return this.transactionsService.findOne(id, req.user.tenantId);
    }

    @Patch(':id/status')
    @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER)
    @ApiOperation({ summary: 'Update transaction status (PAID/CANCELLED)' })
    updateStatus(
        @Param('id') id: string,
        @Body() updateDto: UpdateTransactionStatusDto,
        @Request() req,
    ) {
        return this.transactionsService.updateStatus(id, req.user.tenantId, updateDto);
    }
}
