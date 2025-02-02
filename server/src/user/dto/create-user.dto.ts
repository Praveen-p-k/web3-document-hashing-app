import { IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  address: string;

  @IsString()
  cid: string;

  @IsString()
  file_hash: string;

  @IsString()
  url: string;

  @IsString()
  @IsOptional()
  signature?: string;
}
