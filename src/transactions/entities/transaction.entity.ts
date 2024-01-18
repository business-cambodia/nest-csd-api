import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tran_id: string;

  @Column({ nullable: true })
  unique_tran_id: string;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @Column({ nullable: true })
  reservation_id: string;

  @Column({ nullable: true })
  payway_link: string;

  @Column({ type: 'json', nullable: true })
  payload: object;

  @Column({ nullable: true })
  success_time: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
