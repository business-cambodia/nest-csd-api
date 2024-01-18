import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { UsersModule } from 'src/users/users.module';
import { AddonsModule } from 'src/addons/addons.module';

@Module({
  imports: [UsersModule, AddonsModule],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
