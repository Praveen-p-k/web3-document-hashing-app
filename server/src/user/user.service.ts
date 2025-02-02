import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.save(createUserDto);
  }

  async filterUserByCid(address: string) {
    const user = await this.userRepository.findOneBy({ address });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async updateUserSignature(address: string, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(address, updateUserDto);
  }

  async getSignatureByAddress(address: string): Promise<string> {
    const user = await this.userRepository.findOneBy({ address });

    return user.file_hash;
  }

  async getAllSignatures(): Promise<User[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.signature', 'user.file_hash'])
      .getMany();

    return users;
  }

  remove(address: string) {
    return this.userRepository.delete(address);
  }
}
