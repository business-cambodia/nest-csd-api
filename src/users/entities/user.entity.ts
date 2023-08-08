import { Voucher } from 'src/vouchers/entities/voucher.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: false })
  email: string;

  @Column({ unique: true, nullable: false })
  phone_number: string;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @Column({ nullable: true })
  otpId: string;

  @OneToOne(() => Voucher, (voucher) => voucher.user)
  @JoinColumn()
  voucher: Voucher;

  @Column({ nullable: true })
  voucherId: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
