import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { config } from 'dotenv';
import { PinataModule } from './pinata/pinata.module';

config();

const { SQL_PORT, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_USER, MYSQL_DATABASE } =
  process.env;

@Module({
  imports: [
    UserModule,
    PinataModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: MYSQL_HOST,
      port: +SQL_PORT,
      username: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
      entities: [User],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
