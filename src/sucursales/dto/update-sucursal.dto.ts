import { PartialType } from '@nestjs/mapped-types';
import { CreateSucursaleDto } from './create-sucursal.dto';

export class UpdateSucursaleDto extends PartialType(CreateSucursaleDto) {}
