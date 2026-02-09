import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTenantDto {
    @ApiProperty({ example: 'Bengkel Jaya Motor' })
    @IsString()
    @IsNotEmpty()
    businessName: string;

    @ApiProperty({ example: 'PRO', enum: ['LITE', 'PRO', 'ENTERPRISE'] })
    @IsString()
    @IsNotEmpty()
    subscriptionPlan: string;

    @ApiProperty({ required: false, default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
