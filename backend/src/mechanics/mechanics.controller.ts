import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MechanicsService } from './mechanics.service';
import { CreateMechanicDto, UpdateMechanicDto } from './dto/mechanic.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Mechanics')
@ApiBearerAuth()
@Controller('mechanics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MechanicsController {
    constructor(private readonly mechanicsService: MechanicsService) { }

    @Post()
    @Roles(UserRole.OWNER, UserRole.MANAGER)
    @ApiOperation({ summary: 'Create a new mechanic' })
    create(@Body() createMechanicDto: CreateMechanicDto, @Request() req) {
        return this.mechanicsService.create(req.user.tenantId, createMechanicDto);
    }

    @Get()
    @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER)
    @ApiOperation({ summary: 'List mechanics' })
    @ApiQuery({ name: 'branchId', required: false })
    @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
    findAll(
        @Request() req,
        @Query('branchId') branchId?: string,
        @Query('activeOnly') activeOnly?: string,
    ) {
        const effectiveBranchId = req.user.role === UserRole.CASHIER ? req.user.branchId : branchId;
        return this.mechanicsService.findAll(req.user.tenantId, effectiveBranchId, activeOnly !== 'false');
    }

    @Get(':id')
    @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER)
    @ApiOperation({ summary: 'Get mechanic by ID' })
    findOne(@Param('id') id: string, @Request() req) {
        return this.mechanicsService.findOne(id, req.user.tenantId);
    }

    @Patch(':id')
    @Roles(UserRole.OWNER, UserRole.MANAGER)
    @ApiOperation({ summary: 'Update mechanic' })
    update(@Param('id') id: string, @Body() updateMechanicDto: UpdateMechanicDto, @Request() req) {
        return this.mechanicsService.update(id, req.user.tenantId, updateMechanicDto);
    }

    @Delete(':id')
    @Roles(UserRole.OWNER, UserRole.MANAGER)
    @ApiOperation({ summary: 'Delete mechanic' })
    remove(@Param('id') id: string, @Request() req) {
        return this.mechanicsService.remove(id, req.user.tenantId);
    }
}
