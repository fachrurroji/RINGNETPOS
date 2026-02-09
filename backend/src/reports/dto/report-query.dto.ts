import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReportQueryDto {
    @ApiProperty({ required: false, example: '2026-02-01' })
    @IsString()
    @IsOptional()
    startDate?: string;

    @ApiProperty({ required: false, example: '2026-02-28' })
    @IsString()
    @IsOptional()
    endDate?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    branchId?: string;
}

export class MonthQueryDto {
    @ApiProperty({ required: false, example: '2026-02', description: 'Format: YYYY-MM' })
    @IsString()
    @IsOptional()
    month?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    branchId?: string;
}
