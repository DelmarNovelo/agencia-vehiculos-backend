import { PickType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateEmpleadoDto } from 'src/empleados/dto/update-empleado.dto';

export class UpdateUsuarioDto extends PickType(CreateUsuarioDto, ['persona',] as const) { 
  @ValidateNested()
  @Type(() => UpdateEmpleadoDto)
  empleado: UpdateEmpleadoDto;
}
