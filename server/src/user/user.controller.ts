import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('signatures')
  getAllSignatures() {
    return this.userService.getAllSignatures();
  }

  @Get('address')
  findOne(@Param('id') address: string) {
    return this.userService.filterUserByCid(address);
  }

  @Patch('address')
  update(
    @Param('address') address: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUserSignature(address, updateUserDto);
  }

  @Get('/signatures/:address')
  getSignatureById(@Param('address') address: string) {
    return this.userService.getSignatureByAddress(address);
  }

  @Delete(':id')
  remove(@Param('id') address: string) {
    return this.userService.remove(address);
  }
}
