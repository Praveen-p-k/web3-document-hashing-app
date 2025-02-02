import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
// import CloudWatchTransport from 'winston-cloudwatch';
import * as WinstonCloudwatch from 'winston-cloudwatch';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
