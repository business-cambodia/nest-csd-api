import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { VouchersModule } from './vouchers/vouchers.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
