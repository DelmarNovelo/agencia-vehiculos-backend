import { PickType } from '@nestjs/mapped-types';
import { CreateMarcaDto } from './create-marca.dto';

export class UpdateMarcaDto extends PickType(CreateMarcaDto, ['nombre'] as const) { }
