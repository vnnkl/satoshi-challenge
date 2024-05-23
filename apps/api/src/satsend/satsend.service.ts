import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class SatsendService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getBalance(userId: string): Promise<number> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user.balance;
  }

  async sendSatoshi(
    senderId: string,
    receiverId: string,
    amount: number,
  ): Promise<void> {
    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });
    const receiver = await this.userRepository.findOne({
      where: { id: receiverId },
    });

    if (!sender) {
      throw new HttpException('Sender not found', HttpStatus.NOT_FOUND);
    }
    if (!receiver) {
      throw new HttpException('Receiver not found', HttpStatus.NOT_FOUND);
    }
    if (sender.balance < amount) {
      throw new HttpException('Insufficient balance', HttpStatus.BAD_REQUEST);
    }

    sender.balance -= amount;
    receiver.balance += amount;

    await this.userRepository.save(sender);
    await this.userRepository.save(receiver);

    const transaction = new Transaction();
    transaction.sender = sender;
    transaction.receiver = receiver;
    transaction.amount = amount;
    await this.transactionRepository.save(transaction);
  }

  async getUsers(): Promise<{ id: string; balance: number }[]> {
    const users = await this.userRepository.find();
    return users.map((user) => ({ id: user.id, balance: user.balance }));
  }
}
