import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateContactoDto } from './create-contacto.dto';

export class UpdateContactoDto extends PickType(CreateContactoDto, ['tipoContactoId', 'valorContacto']) {}
