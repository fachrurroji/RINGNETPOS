import { IsString, IsDecimal, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DraftItemDto {
    productId: string;
    mechanicId?: string;
    qty: number;
    priceAtMoment: number;
    mechanicFee?: number;
    subtotal: number;
}

export class CreateDraftDto {
    @IsString()
    @IsOptional()
    customerPlate?: string;

    @IsDecimal()
    totalAmount: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DraftItemDto)
    items: DraftItemDto[];
}

export class UpdateDraftDto extends CreateDraftDto { }
