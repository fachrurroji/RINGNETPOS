import { IsString, IsInt, Min, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { ReturnReason } from '@prisma/client';

export class CreateReturnDto {
    @IsUUID()
    transactionDetailId: string;

    @IsInt()
    @Min(1)
    qty: number;

    @IsEnum(ReturnReason)
    reason: ReturnReason;

    @IsString()
    @IsOptional()
    notes?: string;
}
