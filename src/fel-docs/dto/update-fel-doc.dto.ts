import { PartialType } from '@nestjs/mapped-types';
import { CreateFelDocDto } from './create-fel-doc.dto';

export class UpdateFelDocDto extends PartialType(CreateFelDocDto) {}
