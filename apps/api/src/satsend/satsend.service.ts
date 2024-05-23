import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Transaction } from './entities/transaction.entity';

const logger = new Logger('SatSendService');
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
    logger.log('Fetching users from the database');
    let users;
    try {
      users = await this.userRepository.find();
      logger.log('Users fetched:', users);
    } catch (error) {
      logger.error('Error fetching users:', error);
      throw new HttpException(
        'Failed to fetch users from the database',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return users.map((user) => ({ id: user.id, balance: user.balance }));
  }

  async faucetSatoshi(userId: string): Promise<{ message: string }> {
    logger.log('Faucet satoshi called for user:', userId);
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      const newUser = this.userRepository.create({ id: userId, balance: 5 });
      await this.userRepository.save(newUser);
      return { message: 'User created with a balance of 5 satoshi' };
    }

    if (user.balance > 0) {
      throw new HttpException(
        'User already has a balance',
        HttpStatus.BAD_REQUEST,
      );
    }

    user.balance = 5;
    await this.userRepository.save(user);

    return { message: 'User balance updated to 5 satoshi' };
  }
}
