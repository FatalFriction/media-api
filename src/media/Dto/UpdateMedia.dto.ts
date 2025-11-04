import { PartialType } from '@nestjs/mapped-types';
import { CreateMediaDto } from './CreateMedia.dto';

export class UpdateMediaDto extends PartialType(CreateMediaDto) {}