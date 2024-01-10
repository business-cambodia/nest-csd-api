import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  create(@Body() createUserDto: CreateUsersDto) {
    return this.usersService.signup(createUserDto);
  }

  @Post('/login')
  login(@Body() body: any) {
    return this.usersService.login(body);
  }

  @Post('/sendOtp')
  sendOtp(@Body() body: any) {
    return this.usersService.sendOtp(body);
  }

  @Post('/sendEmailOtp')
  sendEmailOtp(@Body() body: any) {
    return this.usersService.sendEmailOtp(body);
  }

  @Patch('/resetPassword')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(resetPasswordDto);
  }

  @Get()
  findAll() {
    return 'users';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('/booking/:id')
  findBooking(@Param('id') id: string) {
    return this.usersService.findBooking(id);
  }

  @Get('/bookingInvoice/:id')
  findBookingInvoice(@Param('id') id: string) {
    return this.usersService.findBookingInvoice(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUsersDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
