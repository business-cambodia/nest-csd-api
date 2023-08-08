import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { VouchersModule } from 'src/vouchers/vouchers.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), VouchersModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
