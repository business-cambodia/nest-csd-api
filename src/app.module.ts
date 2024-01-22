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
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
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
