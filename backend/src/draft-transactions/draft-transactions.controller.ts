import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { DraftTransactionsService } from './draft-transactions.service';
import { CreateDraftDto, UpdateDraftDto } from './dto/draft-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('draft-transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DraftTransactionsController {
    constructor(private readonly draftTransactionsService: DraftTransactionsService) { }

    @Post()
    @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER)
    async create(@Request() req, @Body() createDto: CreateDraftDto) {
        return this.draftTransactionsService.create(
            req.user.userId,
            req.user.tenantId,
            req.user.branchId,
            createDto,
        );
    }

    @Get()
    @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER)
    async findAll(
        @Request() req,
        @Query('branchId') branchId?: string,
        @Query('userId') userId?: string,
    ) {
        return this.draftTransactionsService.findAll(
            req.user.tenantId,
            branchId,
            userId,
        );
    }

    @Get(':id')
    @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER)
    async findOne(@Request() req, @Param('id') id: string) {
        return this.draftTransactionsService.findOne(id, req.user.tenantId);
    }

    @Patch(':id')
    @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER)
    async update(
        @Request() req,
        @Param('id') id: string,
        @Body() updateDto: UpdateDraftDto,
    ) {
        return this.draftTransactionsService.update(id, req.user.tenantId, updateDto);
    }

    @Delete(':id')
    @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER)
    async remove(@Request() req, @Param('id') id: string) {
        return this.draftTransactionsService.remove(id, req.user.tenantId);
    }

    @Post(':id/convert')
    @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER)
    async convertToTransaction(@Request() req, @Param('id') id: string) {
        return this.draftTransactionsService.convertToTransaction(
            id,
            req.user.tenantId,
        );
    }
}
