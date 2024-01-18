import { Module } from '@nestjs/common';
import { AbaService } from './aba.service';
import { AbaController } from './aba.controller';
import { RoomsModule } from 'src/rooms/rooms.module';
import { AddonsModule } from 'src/addons/addons.module';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [RoomsModule, AddonsModule, TransactionsModule],
  controllers: [AbaController],
  providers: [AbaService],
})
export class AbaModule {}
