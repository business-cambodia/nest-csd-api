import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.signup(createUserDto);
  }

  @Post('/login')
  login(@Body() body: any) {
    return this.userService.login(body);
  }

  @Patch('/allowSms')
  allowSms(@Body() body: any) {
    return this.userService.allowSms(body);
  }

  @Post('/sendOtp')
  sendOtp(@Body() body: any) {
    return this.userService.sendOtp(body);
  }

  @Post('/sendOtpLogin')
  sendOtpLogin(@Body() body: any) {
    return this.userService.sendOtpLogin(body);
  }

  @Get('/getOtp')
  getOtp() {
    return this.userService.sendPhoneOtp('', '223344');
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findByPhone(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
