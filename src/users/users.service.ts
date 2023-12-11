import { HttpException, Injectable } from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { Users } from './entities/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async signup(createUserDto: CreateUsersDto) {
    // createUserDto.phone_number = '0' + createUserDto.phone_number;
    const userExist = await this.findByEmail(createUserDto.email);
    if (userExist) {
      throw new HttpException('Email is already existed!', 400);
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;
    const users = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(users);
  }

  async login(body: any) {
    const user = await this.findByEmail(body?.email);
    if (!user) {
      throw new HttpException('Email is not existed!', 400);
    }
    const isPasswordMatch = await bcrypt.compare(body.password, user.password);
    if (!isPasswordMatch) {
      throw new HttpException('Password is not correct!', 400);
    }
    const { password, ...returnedUser } = user;
    return returnedUser;
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findByEmail(email: string) {
    const users = await this.usersRepository.findOne({
      where: { email: email },
    });
    return users;
  }

  findOne(id: string) {
    const user = this.usersRepository.findOne({
      where: { id: id },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'phone_number',
        'bookings',
      ],
    });
    return user;
  }

  update(id: number, updateUserDto: UpdateUsersDto) {
    return `This action updates a #${id} user`;
  }

  async updateBookings(user: any) {
    return this.usersRepository.save(user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findBooking(id: string) {
    try {
      const res = await fetch(
        `https://hotels.cloudbeds.com/api/v1.1/getReservation?reservationID=${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.CLOUD_BEDS_TOKEN}`,
          },
        },
      );
      return res.json();
    } catch (error) {}
  }

  generateOTP() {
    const digits = '0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += digits[Math.floor(Math.random() * 10)];
    }
    return code;
  }

  async sendOtp(body: any) {
    body.phone_number = '0' + body.phone_number;
    const otp = this.generateOTP();
    this.sendPhoneOtp(body.phone_number, otp);
    // this.sendEmailOtp(body.email, otp);
    return { otp: otp };
  }

  async sendPhoneOtp(phone_number: string, otp: string) {
    try {
      const res = await fetch(
        `https://api.mekongsms.com/api/sendsms.aspx?username=${process.env.SMS_Username}&pass=${process.env.SMS_Password}&sender=${process.env.SMS_Sender_Name}&smstext=Your phone verification OTP is ${otp} , Enter this code to confirm your phone number at BAY OF LIGHTS ENTERTAINMENT.&gsm=855${phone_number}&int=1`,
      );
      // const res = await sth.text();
      return res;
    } catch (error) {
      console.log(error);
    }
  }
}
