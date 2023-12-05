import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { VouchersModule } from 'src/vouchers/vouchers.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), VouchersModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
