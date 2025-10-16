import { PickType } from '@nestjs/mapped-types';
import { CreateMunicipioDto } from './create-municipio.dto';

export class UpdateMunicipioDto extends PickType(CreateMunicipioDto, ['nombre']) { }
