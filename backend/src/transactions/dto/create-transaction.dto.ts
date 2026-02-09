import { IsNotEmpty, IsString, IsOptional, IsEnum, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TransactionStatus } from '@prisma/client';

export class TransactionItemDto {
    @ApiProperty({ example: 'product-uuid' })
    @IsString()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @Type(() => Number)
    qty: number;

    @ApiProperty({ example: 75000, description: 'Price at moment of sale (can be flexible for services)' })
    @IsNumber()
    @Type(() => Number)
    priceAtMoment: number;

    @ApiProperty({ required: false, example: 'mechanic-uuid' })
    @IsString()
    @IsOptional()
    mechanicId?: string;

    @ApiProperty({ required: false, example: 25000, description: 'Mechanic fee for this item' })
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    mechanicFee?: number;
}

export class CreateTransactionDto {
    @ApiProperty({ example: 'branch-uuid' })
    @IsString()
    @IsNotEmpty()
    branchId: string;

    @ApiProperty({ required: false, example: 'B 1234 ABC' })
    @IsString()
    @IsOptional()
    customerPlate?: string;

    @ApiProperty({ type: [TransactionItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TransactionItemDto)
    items: TransactionItemDto[];
}

export class UpdateTransactionStatusDto {
    @ApiProperty({ enum: TransactionStatus, example: 'PAID' })
    @IsEnum(TransactionStatus)
    @IsNotEmpty()
    status: TransactionStatus;
}
