import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @Roles(UserRole.OWNER, UserRole.MANAGER)
    @ApiOperation({ summary: 'Create a new product (Owner/Manager)' })
    create(@Body() createProductDto: CreateProductDto, @Request() req) {
        return this.productsService.create(req.user.tenantId, createProductDto);
    }

    @Get()
    @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER)
    @ApiOperation({ summary: 'Get all products for current tenant' })
    findAll(@Request() req) {
        return this.productsService.findAll(req.user.tenantId);
    }

    @Get('search')
    @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER)
    @ApiOperation({ summary: 'Search products by name or SKU' })
    @ApiQuery({ name: 'q', required: true })
    search(@Query('q') query: string, @Request() req) {
        return this.productsService.search(query, req.user.tenantId);
    }

    @Get('scan/:sku')
    @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER)
    @ApiOperation({ summary: 'Scan product by SKU/barcode (high speed)' })
    findBySku(@Param('sku') sku: string, @Request() req) {
        return this.productsService.findBySku(sku, req.user.tenantId);
    }

    @Get(':id')
    @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER)
    @ApiOperation({ summary: 'Get a product by ID' })
    findOne(@Param('id') id: string, @Request() req) {
        return this.productsService.findOne(id, req.user.tenantId);
    }

    @Patch(':id')
    @Roles(UserRole.OWNER, UserRole.MANAGER)
    @ApiOperation({ summary: 'Update a product (Owner/Manager)' })
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Request() req) {
        return this.productsService.update(id, req.user.tenantId, updateProductDto);
    }

    @Delete(':id')
    @Roles(UserRole.OWNER, UserRole.MANAGER)
    @ApiOperation({ summary: 'Delete a product (Owner/Manager)' })
    remove(@Param('id') id: string, @Request() req) {
        return this.productsService.remove(id, req.user.tenantId);
    }
}
