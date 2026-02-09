import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password'] as const)) {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    @MinLength(6)
    password?: string;
}
