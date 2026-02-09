import { IsNotEmpty, IsString, IsOptional, IsEnum, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductType } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @ApiProperty({ example: 'SKU001' })
    @IsString()
    @IsNotEmpty()
    sku: string;

    @ApiProperty({ example: 'Oli Motor 1L' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ enum: ProductType, example: 'GOODS' })
    @IsEnum(ProductType)
    @IsNotEmpty()
    type: ProductType;

    @ApiProperty({ example: 50000 })
    @IsNumber()
    @Type(() => Number)
    basePrice: number;

    @ApiProperty({ required: false, example: 75000 })
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    sellPrice?: number;

    @ApiProperty({ required: false, default: false })
    @IsBoolean()
    @IsOptional()
    isFlexiblePrice?: boolean;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    imageUrl?: string;
}
