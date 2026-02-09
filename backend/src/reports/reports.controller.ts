import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get('daily')
    @Roles(UserRole.OWNER, UserRole.MANAGER)
    @ApiOperation({ summary: 'Get daily revenue report' })
    @ApiQuery({ name: 'date', required: false, example: '2026-02-09' })
    @ApiQuery({ name: 'branchId', required: false })
    async getDailyReport(
        @Request() req,
        @Query('date') dateStr?: string,
        @Query('branchId') branchId?: string,
    ) {
        const date = dateStr ? new Date(dateStr) : new Date();
        return this.reportsService.getDailyReport(req.user.tenantId, date, branchId);
    }

    @Get('mechanic-commission')
    @Roles(UserRole.OWNER, UserRole.MANAGER)
    @ApiOperation({ summary: 'Get mechanic commission report' })
    @ApiQuery({ name: 'month', required: false, example: '2026-02' })
    @ApiQuery({ name: 'branchId', required: false })
    async getMechanicCommission(
        @Request() req,
        @Query('month') month?: string,
        @Query('branchId') branchId?: string,
    ) {
        // Default to current month
        const now = new Date();
        const targetMonth = month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        const [year, mon] = targetMonth.split('-').map(Number);
        const startDate = new Date(year, mon - 1, 1);
        const endDate = new Date(year, mon, 0, 23, 59, 59, 999);

        return this.reportsService.getMechanicCommission(
            req.user.tenantId,
            startDate,
            endDate,
            branchId,
        );
    }

    @Get('top-products')
    @Roles(UserRole.OWNER, UserRole.MANAGER)
    @ApiOperation({ summary: 'Get top selling products' })
    @ApiQuery({ name: 'month', required: false, example: '2026-02' })
    @ApiQuery({ name: 'branchId', required: false })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    async getTopProducts(
        @Request() req,
        @Query('month') month?: string,
        @Query('branchId') branchId?: string,
        @Query('limit') limit?: string,
    ) {
        const now = new Date();
        const targetMonth = month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        const [year, mon] = targetMonth.split('-').map(Number);
        const startDate = new Date(year, mon - 1, 1);
        const endDate = new Date(year, mon, 0, 23, 59, 59, 999);

        return this.reportsService.getTopProducts(
            req.user.tenantId,
            startDate,
            endDate,
            branchId,
            limit ? parseInt(limit) : 10,
        );
    }

    @Get('vehicle-history/:plate')
    @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER)
    @ApiOperation({ summary: 'Get vehicle service history by plate number' })
    async getVehicleHistory(@Param('plate') plate: string, @Request() req) {
        return this.reportsService.getVehicleHistory(req.user.tenantId, plate);
    }

    @Get('low-stock')
    @Roles(UserRole.OWNER, UserRole.MANAGER)
    @ApiOperation({ summary: 'Get low stock products' })
    @ApiQuery({ name: 'branchId', required: false })
    async getLowStock(
        @Request() req,
        @Query('branchId') branchId?: string,
    ) {
        return this.reportsService.getLowStock(req.user.tenantId, branchId);
    }
}

