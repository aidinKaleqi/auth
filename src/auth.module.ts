import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../config/database.config';
import { User } from '../entity/user.entity';
import { Auth } from '../entity/auth.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
    }),
    TypeOrmModule.forFeature([User, Auth]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
