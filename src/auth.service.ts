import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Auth } from '../entity/auth.entity';
import { hashPassword, comparePassword } from '../utils/password.utils';
import * as jwt from 'jsonwebtoken';
import * as process from 'node:process';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
  ) {}

  async checkUsername(username: string): Promise<boolean> {
    const result = await this.userRepository.findOne({
      where: { username },
    });
    return Boolean(result);
  }

  async insertUser(body: any): Promise<boolean> {
    const { username, password, fullName } = body;
    const hashedPassword = await hashPassword(password);
    await this.userRepository.insert({
      username,
      password: hashedPassword,
      fullName,
    });
    return true;
  }

  async login(username: string, password: string): Promise<string> {
    const userData = await this.userRepository.findOne({
      where: { username },
    });
    await comparePassword(password, userData.password);
    const payload = { username: userData.username, userId: userData.id };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET);
    await this.authRepository.insert({
      token,
      userId: userData.id,
    });
    return token;
  }

  async verifyToken(token: string): Promise<any> {
    const decoded = this.decodeToken(token);
    if (decoded.status) {
      const authRecord = await this.authRepository.findOne({
        where: { userId: decoded.decoded.userId, token },
      });
      if (!authRecord) {
        decoded.status = false;
      }
    }
    return {
      id: decoded.decoded.userId,
      username: decoded.decoded.username,
      status: decoded.status,
    };
  }

  decodeToken(token: string) {
    const result = {
      status: true,
      decoded: null,
    };
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      result.decoded = decoded;
      return result;
    } catch (error) {
      console.log(error);
      result.status = false;
      return result;
    }
  }
}
