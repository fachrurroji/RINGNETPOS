import { IsNotEmpty, IsString, IsOptional, IsEnum, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
    @ApiProperty({ example: 'john_manager' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: 'SecurePass123!' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ enum: UserRole, example: 'MANAGER' })
    @IsEnum(UserRole)
    @IsNotEmpty()
    role: UserRole;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    tenantId?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    branchId?: string;
}
