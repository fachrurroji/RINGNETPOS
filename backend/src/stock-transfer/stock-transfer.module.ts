import { Module } from '@nestjs/common';
import { StockTransferService } from './stock-transfer.service';
import { StockTransferController } from './stock-transfer.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [StockTransferController],
    providers: [StockTransferService],
})
export class StockTransferModule { }
