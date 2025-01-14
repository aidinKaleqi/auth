import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { RequestIdInterceptor } from '../interceptor/requestId.Interceptor';
import * as dotenv from 'dotenv';
import { AllExceptionsFilter } from '../filters/all-exceptions.filter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new RequestIdInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
