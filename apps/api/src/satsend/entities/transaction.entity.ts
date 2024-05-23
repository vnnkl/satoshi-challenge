import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: number;

  @ManyToOne(() => User, (user) => user.transactionsSent)
  sender: User;

  @ManyToOne(() => User, (user) => user.transactionsReceived)
  receiver: User;
}
