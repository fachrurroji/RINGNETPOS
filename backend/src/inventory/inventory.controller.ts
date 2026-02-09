import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto, AdjustInventoryDto } from './dto/inventory.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Inventory')
@ApiBearerAuth()
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Post()
    @Roles(UserRole.OWNER, UserRole.MANAGER)
    @ApiOperation({ summary: 'Initialize inventory for a product at a branch' })
    create(@Body() createInventoryDto: CreateInventoryDto, @Request() req) {
        return this.inventoryService.create(req.user.tenantId, createInventoryDto);
    }

    @Get()
    @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER)
    @ApiOperation({ summary: 'List inventory' })
    @ApiQuery({ name: 'branchId', required: false })
    findAll(@Request() req, @Query('branchId') branchId?: string) {
        const effectiveBranchId = req.user.role === UserRole.CASHIER ? req.user.branchId : branchId;
        return this.inventoryService.findAll(req.user.tenantId, effectiveBranchId);
    }

    @Get('low-stock')
    @Roles(UserRole.OWNER, UserRole.MANAGER)
    @ApiOperation({ summary: 'Get low stock items' })
    @ApiQuery({ name: 'branchId', required: false })
    findLowStock(@Request() req, @Query('branchId') branchId?: string) {
        return this.inventoryService.findLowStock(req.user.tenantId, branchId);
    }

    @Patch(':id')
    @Roles(UserRole.OWNER, UserRole.MANAGER)
    @ApiOperation({ summary: 'Adjust stock manually' })
    adjust(@Param('id') id: string, @Body() adjustDto: AdjustInventoryDto, @Request() req) {
        return this.inventoryService.adjust(id, req.user.tenantId, adjustDto);
    }
}
