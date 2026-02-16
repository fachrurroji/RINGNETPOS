import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { StockTransferService } from './stock-transfer.service';
import { CreateStockTransferDto } from './dto/create-stock-transfer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('stock-transfer')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StockTransferController {
    constructor(private readonly stockTransferService: StockTransferService) { }

    @Post()
    @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.WAREHOUSE)
    async create(@Request() req, @Body() createDto: CreateStockTransferDto) {
        return this.stockTransferService.create(
            req.user.userId,
            req.user.tenantId,
            createDto,
        );
    }

    @Get()
    @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.WAREHOUSE)
    async findAll(
        @Request() req,
        @Query('branchId') branchId?: string,
        @Query('productId') productId?: string,
    ) {
        return this.stockTransferService.findAll(
            req.user.tenantId,
            branchId,
            productId,
        );
    }

    @Get(':id')
    @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.WAREHOUSE)
    async findOne(@Request() req, @Param('id') id: string) {
        return this.stockTransferService.findOne(id, req.user.tenantId);
    }
}
