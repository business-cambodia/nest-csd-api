import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
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
    UserModule,
    VouchersModule,
    RoomsModule,
  ],
  controllers: [AppController, ReviewsController],
  providers: [AppService],
})
export class AppModule {}
