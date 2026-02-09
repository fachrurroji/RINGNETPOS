import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateInventoryDto {
    @ApiProperty({ example: 'branch-uuid' })
    @IsString()
    @IsNotEmpty()
    branchId: string;

    @ApiProperty({ example: 'product-uuid' })
    @IsString()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ example: 100 })
    @IsNumber()
    @Type(() => Number)
    qty: number;

    @ApiProperty({ required: false, example: 10 })
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    minStockAlert?: number;
}

export class AdjustInventoryDto {
    @ApiProperty({ example: 50, description: 'New quantity (set) or adjustment (+/-)' })
    @IsNumber()
    @Type(() => Number)
    qty: number;

    @ApiProperty({ required: false, default: false, description: 'If true, qty is added/subtracted. If false, qty replaces current stock.' })
    @IsOptional()
    isAdjustment?: boolean;
}
