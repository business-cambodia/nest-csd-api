import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { VouchersModule } from './vouchers/vouchers.module';
import { RoomsModule } from './rooms/rooms.module';
import { ReviewsController } from './reviews/reviews.controller';

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
    UsersModule,
    VouchersModule,
    RoomsModule,
  ],
  controllers: [AppController, ReviewsController],
  providers: [AppService],
})
export class AppModule {}
