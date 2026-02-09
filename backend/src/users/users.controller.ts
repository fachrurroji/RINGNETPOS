import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @Roles(UserRole.SUPERADMIN, UserRole.OWNER)
    @ApiOperation({ summary: 'Create a new user (Superadmin/Owner)' })
    create(@Body() createUserDto: CreateUserDto, @Request() req) {
        // If owner, force tenantId to their own tenant
        if (req.user.role === UserRole.OWNER && req.user.tenantId) {
            createUserDto.tenantId = req.user.tenantId;
        }
        return this.usersService.create(createUserDto);
    }

    @Get()
    @Roles(UserRole.SUPERADMIN, UserRole.OWNER, UserRole.MANAGER)
    @ApiOperation({ summary: 'Get all users' })
    @ApiQuery({ name: 'tenantId', required: false })
    findAll(@Request() req, @Query('tenantId') tenantId?: string) {
        // Non-superadmin can only see their tenant's users
        if (req.user.role !== UserRole.SUPERADMIN) {
            return this.usersService.findAll(req.user.tenantId);
        }
        return this.usersService.findAll(tenantId);
    }

    @Get(':id')
    @Roles(UserRole.SUPERADMIN, UserRole.OWNER, UserRole.MANAGER)
    @ApiOperation({ summary: 'Get a user by ID' })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @Roles(UserRole.SUPERADMIN, UserRole.OWNER)
    @ApiOperation({ summary: 'Update a user (Superadmin/Owner)' })
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    @Roles(UserRole.SUPERADMIN, UserRole.OWNER)
    @ApiOperation({ summary: 'Delete a user (Superadmin/Owner)' })
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
