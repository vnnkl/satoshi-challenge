import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SatsendController } from './satsend.controller';
import { SatsendService } from './satsend.service';
import { User } from './entities/user.entity';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Transaction])],
  controllers: [SatsendController],
  providers: [SatsendService],
})
export class SatsendModule {}
