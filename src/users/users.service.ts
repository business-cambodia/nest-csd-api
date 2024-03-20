import { HttpException, Injectable } from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { Users } from './entities/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ResetPasswordDto } from './dto/reset-password.dto';

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
      throw new HttpException({ message: ['Email is already existed!'] }, 400);
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;
    const users = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(users);
  }

  async login(body: any) {
    const user = await this.findByEmail(body?.email);
    if (!user) {
      throw new HttpException({ message: ['Email is not existed!'] }, 400);
    }
    const isPasswordMatch = await bcrypt.compare(body.password, user.password);
    if (!isPasswordMatch) {
      throw new HttpException({ message: ['Password is not correct!'] }, 400);
    }
    const { password, ...returnedUser } = user;
    return returnedUser;
  }

  findAll() {
    return this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.created_at',
        'user.phone_number',
        'user.bookings',
      ]) // Exclude 'user.password'
      .getMany();
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

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.findByEmail(resetPasswordDto.email);
    if (user.otpCode != resetPasswordDto.otp_code) {
      throw new HttpException({ message: ['Wrong OTP Code'] }, 400);
    }
    user.password = await bcrypt.hash(resetPasswordDto.newPassword, 10);
    user.otpCode = null;
    this.usersRepository.save(user);
    return { message: 'password updated' };
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

  async findBookingInvoice(id: string) {
    try {
      const res = await fetch(
        `https://hotels.cloudbeds.com/api/v1.1/getReservationInvoiceInformation?reservationID=${id}`,
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

  async sendEmailOtp(body: any) {
    const clientEmail = body.email;
    const user = await this.findByEmail(clientEmail);
    if (!user) {
      throw new HttpException({ message: ['Email is not existed!'] }, 400);
    }
    const otp_code = this.generateOTP();
    user.otpCode = otp_code;
    this.usersRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodemailer = require('nodemailer');
    try {
      // generate the 6 digits code
      // get the client email from request body
      const senderEmail = process.env.EMAIL;
      // construct the transporter object for sending email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
      //   the message to be sent
      const html = `
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:20px auto;width:100%;padding:10px 0">
        <div style="border-bottom:1px solid #eee">
          <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Summer Bay Beach Club & Cabins</a>
        </div>
        <p>Your email verification OTP is ${otp_code} , Enter this code to confirm your email.</p>
        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp_code}</h2>
        <p style="font-size:0.9em;">Regards,<br />Summer Bay Beach Club & Cabins</p>
      </div>
      </div>
        `;
      const mailOptions = {
        from: {
          name: 'Summerbay',
          address: senderEmail,
        },
        to: clientEmail,
        subject: 'OTP Verification',
        html,
      };

      // send the email
      await transporter.sendMail(mailOptions);
      return { message: 'email sent successfully' };
    } catch (error) {
      console.log(error);
      return { message: 'something went wrong while sending the OTP' };
    }
  }
}
