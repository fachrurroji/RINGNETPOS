import { IsString, IsInt, Min, IsOptional, IsUUID } from 'class-validator';

export class CreateStockTransferDto {
    @IsUUID()
    productId: string;

    @IsUUID()
    fromBranchId: string;

    @IsUUID()
    toBranchId: string;

    @IsInt()
    @Min(1)
    qty: number;

    @IsString()
    @IsOptional()
    notes?: string;
}
