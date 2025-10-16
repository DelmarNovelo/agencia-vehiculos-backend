import { PartialType } from '@nestjs/mapped-types';
import { CreateModuloPermisoDto } from './create-modulo-permiso.dto';

export class UpdateModuloPermisoDto extends PartialType(CreateModuloPermisoDto) {}
