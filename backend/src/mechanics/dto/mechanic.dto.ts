import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMechanicDto {
    @ApiProperty({ example: 'Budi Mekanik' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ required: false, example: '08123456789' })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({ required: false, example: 'branch-uuid' })
    @IsString()
    @IsOptional()
    branchId?: string;

    @ApiProperty({ required: false, default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

export class UpdateMechanicDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    branchId?: string;

    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
