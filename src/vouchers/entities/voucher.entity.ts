import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Voucher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  code: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column()
  type: string;

  @Column()
  expired_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => User, (user) => user.voucher, { onDelete: 'CASCADE' })
  user: User;
}
