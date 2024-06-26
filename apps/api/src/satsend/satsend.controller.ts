import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { SatsendService } from './satsend.service';

const logger = new Logger('SatSendController');
@Controller('satsend')
export class SatsendController {
  constructor(private readonly satsendService: SatsendService) {}

  @Get('balance/:userId')
  async getBalance(
    @Param('userId') userId: string,
  ): Promise<{ balance: number }> {
    try {
      const balance = await this.satsendService.getBalance(userId);
      return { balance };
    } catch (error) {
      throw new HttpException(
        'Failed to get balance',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('send')
  async sendSatoshi(
    @Body('senderId') senderId: string,
    @Body('receiverId') receiverId: string,
    @Body('amount') amount: number,
  ): Promise<{ message: string }> {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new HttpException(
        'Amount must be a positive integer',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await this.satsendService.sendSatoshi(senderId, receiverId, amount);
      return { message: 'satoshi sent successfully' };
    } catch (error) {
      throw new HttpException(
        'Failed to send satoshi',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('users')
  async getUsers(): Promise<{ users: { id: string; balance: number }[] }> {
    try {
      const users = await this.satsendService.getUsers();
      return { users };
    } catch (error) {
      throw new HttpException(
        'Failed to get users from service',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('faucet')
  async faucetSatoshi(
    @Body('userId') userId: string,
  ): Promise<{ message: string }> {
    logger.log('controller - faucetSatoshi called with userId: ', userId);
    try {
      const result = await this.satsendService.faucetSatoshi(userId);
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to provide faucet satoshi',
        HttpStatus.I_AM_A_TEAPOT,
      );
    }
  }
}
