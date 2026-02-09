import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'superadmin' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: 'SuperAdmin123!' })
    @IsString()
    @IsNotEmpty()
    password: string;
}
