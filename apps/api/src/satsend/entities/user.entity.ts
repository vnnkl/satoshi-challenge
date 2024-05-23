import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  balance: number;

  @OneToMany(() => Transaction, (transaction) => transaction.sender)
  transactionsSent: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.receiver)
  transactionsReceived: Transaction[];
}
