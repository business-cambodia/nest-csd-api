import { Injectable } from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voucher } from './entities/voucher.entity';
import { UUID } from 'crypto';

@Injectable()
export class VouchersService {
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
  ) {}

  generateVoucherCode() {
    const passwordLength = 5;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';

    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }

    return password;
  }

  async create(voucherType: string) {
    const voucher = this.voucherRepository.create({
      code: this.generateVoucherCode(),
      type: voucherType,
      expired_at: new Date(new Date().getFullYear(), 10, 30), // set expiration date to november this year
    });
    return await this.voucherRepository.save(voucher);
  }

  findAll() {
    return `This action returns all vouchers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} voucher`;
  }

  async updateStatus(id: string, body: any) {
    const voucher = await this.voucherRepository.findOneBy({ id: id });
    if (voucher) {
      voucher.status = body.status;
      return await this.voucherRepository.save(voucher);
    } else {
      return { message: 'Voucher not found' };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} voucher`;
  }
}
