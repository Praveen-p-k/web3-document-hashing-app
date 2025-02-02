import { PartialType } from '@nestjs/mapped-types';
import { CreatePinataDto } from './create-pinata.dto';

export class UpdatePinataDto extends PartialType(CreatePinataDto) {}
