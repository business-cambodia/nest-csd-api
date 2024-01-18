import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { RoomsModule } from './rooms/rooms.module';
import { ReviewsController } from './reviews/reviews.controller';
import { UsersModule } from './users/users.module';
import { AddonsModule } from './addons/addons.module';
import { AbaModule } from './aba/aba.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '146.190.108.43',
      username: 'postgres',
      password: 'Price-Spy-DB@#124',
      database: 'csd_db',
      autoLoadEntities: true,
      // synchronize: true,
    }),
    UserModule,
    VouchersModule,
    RoomsModule,
    UsersModule,
    AddonsModule,
    AbaModule,
    TransactionsModule,
  ],
  controllers: [AppController, ReviewsController],
  providers: [AppService],
})
export class AppModule {}
