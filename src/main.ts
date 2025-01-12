import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { RequestIdInterceptor } from '../interceptor/requestId.Interceptor';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new RequestIdInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
