import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validationSchemaForEnv } from './config/environment-variables';
import { PersistenceModule } from './persistence/persistence.module';
import { SatsendModule } from './satsend/satsend.module';
import { User } from './satsend/entities/user.entity';
import { Transaction } from './satsend/entities/transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchemaForEnv,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Transaction],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Transaction]),
    PersistenceModule,
    SatsendModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
