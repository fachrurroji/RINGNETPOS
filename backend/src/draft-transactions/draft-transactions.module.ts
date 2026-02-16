import { Module } from '@nestjs/common';
import { DraftTransactionsService } from './draft-transactions.service';
import { DraftTransactionsController } from './draft-transactions.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [DraftTransactionsController],
    providers: [DraftTransactionsService],
})
export class DraftTransactionsModule { }
