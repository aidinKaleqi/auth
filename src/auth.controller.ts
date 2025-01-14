import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { VerifyDto } from '../dto/verify.dto';
import { TransformResponseInterceptor } from '../interceptor/transform-response.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(TransformResponseInterceptor)
  async signUp(@Body() body: SignupDto) {
    const check: boolean = await this.authService.checkUsername(body.username);
    if (check) throw 'User Already Exists';
    await this.authService.insertUser(body);
    return {
      status: 'success',
      message: 'User created successfully',
    };
  }

  @Post('login')
  @UseInterceptors(TransformResponseInterceptor)
  async login(@Body() body: LoginDto) {
    const checkUsername = await this.authService.checkUsername(body.username);
    if (!checkUsername) {
      throw {
        status: 'error',
        message: 'Incorrect username or password',
      };
    }
    const { username, password } = body;
    const token: string = await this.authService.login(username, password);
    return {
      token,
    };
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformResponseInterceptor)
  async verify(@Body() body: VerifyDto) {
    const result = await this.authService.verifyToken(body.token);
    return result;
  }
}
