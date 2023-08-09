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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  create(@Body() createUserDto: CreateUserDto) {
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

  @Post('/sendOtpLogin')
  sendOtpLogin(@Body() body: any) {
    return this.usersService.sendOtpLogin(body);
  }

  @Get('/getOtp')
  getOtp() {
    return this.usersService.sendPhoneOtp('', '223344');
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findByPhone(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
