import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { VouchersService } from 'src/vouchers/vouchers.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly voucherService: VouchersService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    createUserDto.phone_number = '0' + createUserDto.phone_number;
    const userExist = await this.findByPhone(createUserDto.phone_number);
    if (userExist) {
      return { message: 'Phone number is already existed please login' };
    }
    console.log(createUserDto);
    const voucher = await this.voucherService.create(createUserDto.voucherType);
    createUserDto.voucherId = voucher.id;
    const user = this.userRepository.create(createUserDto);
    this.userRepository.save(user);
    return user;
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
    const user = await this.userRepository.findOne({
      where: { phone_number: body.phone_number },
    });
    if (user) {
      return 'Phone number is already existed please login';
    }
    const otp = this.generateOTP();
    // this.sendEmailOtp(body.email, otp);
    return { otp: otp };
  }

  async sendPhoneOtp(phone_number: string, otp: string) {
    try {
      const res = await fetch(
        `'https://sandbox.mekongsms.com/api/sendsms.aspx?username=bs_cambodia@apitest&pass=3b84f2fa0c7e86a16097fc7b4dbb2f9c&sender=SMS Testing&smstext=Your phone verification OTP is [${otp}]. Enter this code to confirm your phone number.&gsm=85516398747&int=1'`,
      );
      // const res = await sth.text();
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  async activateUser(updateUserDto: UpdateUserDto) {
    const voucher = await this.voucherService.create(updateUserDto.voucherType);
    const user = await this.userRepository.update(
      { phone_number: updateUserDto.phone_number },
      {
        status: true,
        voucherId: voucher.id,
      },
    );
    return user;
  }

  async sendEmailOtp(clientEmail: string, otp: string) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodemailer = require('nodemailer');
    try {
      // generate the 6 digits code
      // const otp_code = otp();
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
      <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
          <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Your Brand</a>
        </div>
        <p style="font-size:1.1em">Hi,</p>
        <p>Thank you for choosing Your Brand. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
        <p style="font-size:0.9em;">Regards,<br />Your Brand</p>
        <hr style="border:none;border-top:1px solid #eee" />
        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
          <p>Your Brand Inc</p>
          <p>1600 Amphitheatre Parkway</p>
          <p>California</p>
        </div>
      </div>
      </div>
        `;
      const mailOptions = {
        from: senderEmail,
        to: clientEmail,
        subject: 'OTP Verification',
        html,
      };

      // send the email
      const response = await transporter.sendMail(mailOptions);
      return 'email sent successfully';
    } catch (error) {
      console.log(error);
      return 'something went wrong while sending the OTP';
    }
  }

  // sendPhoneOtp() {

  // }

  findAll() {
    return this.userRepository.find({ relations: ['otp'] });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByPhone(phone: string) {
    const user = await this.userRepository.findOne({
      where: { phone_number: phone },
      relations: ['otp'],
    });
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
