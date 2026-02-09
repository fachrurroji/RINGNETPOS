import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Branches')
@ApiBearerAuth()
@Controller('branches')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BranchesController {
    constructor(private readonly branchesService: BranchesService) { }

    @Post()
    @Roles(UserRole.OWNER)
    @ApiOperation({ summary: 'Create a new branch (Owner only)' })
    create(@Body() createBranchDto: CreateBranchDto, @Request() req) {
        return this.branchesService.create(req.user.tenantId, createBranchDto);
    }

    @Get()
    @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER)
    @ApiOperation({ summary: 'Get all branches for current tenant' })
    findAll(@Request() req) {
        return this.branchesService.findAll(req.user.tenantId);
    }

    @Get(':id')
    @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER)
    @ApiOperation({ summary: 'Get a branch by ID' })
    findOne(@Param('id') id: string, @Request() req) {
        return this.branchesService.findOne(id, req.user.tenantId);
    }

    @Patch(':id')
    @Roles(UserRole.OWNER, UserRole.MANAGER)
    @ApiOperation({ summary: 'Update a branch (Owner/Manager)' })
    update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto, @Request() req) {
        return this.branchesService.update(id, req.user.tenantId, updateBranchDto);
    }

    @Delete(':id')
    @Roles(UserRole.OWNER)
    @ApiOperation({ summary: 'Delete a branch (Owner only)' })
    remove(@Param('id') id: string, @Request() req) {
        return this.branchesService.remove(id, req.user.tenantId);
    }
}
