import { Module } from '@nestjs/common';
import { multerOptions } from 'src/multer.config';
import { MulterModule } from '@nestjs/platform-express';
import { PinataController } from './pinata.controller';
import { PinataService } from './pinata.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [MulterModule.register(multerOptions), UserModule],
  controllers: [PinataController],
  providers: [PinataService],
})
export class PinataModule {}
