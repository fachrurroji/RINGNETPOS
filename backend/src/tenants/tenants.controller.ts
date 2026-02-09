import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Tenants')
@ApiBearerAuth()
@Controller('tenants')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPERADMIN)
export class TenantsController {
    constructor(private readonly tenantsService: TenantsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new tenant (Superadmin only)' })
    @ApiResponse({ status: 201, description: 'Tenant created successfully' })
    create(@Body() createTenantDto: CreateTenantDto) {
        return this.tenantsService.create(createTenantDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all tenants (Superadmin only)' })
    findAll() {
        return this.tenantsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a tenant by ID (Superadmin only)' })
    findOne(@Param('id') id: string) {
        return this.tenantsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a tenant (Superadmin only)' })
    update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
        return this.tenantsService.update(id, updateTenantDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a tenant (Superadmin only)' })
    remove(@Param('id') id: string) {
        return this.tenantsService.remove(id);
    }
}
