import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBranchDto {
    @ApiProperty({ example: 'Cabang Utama' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ required: false, example: 'Jl. Raya No. 1' })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty({ required: false, example: '08123456789' })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({ required: false, default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
