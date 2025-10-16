import { PickType } from '@nestjs/mapped-types';
import { CreateEmpleadoDto } from './create-empleado.dto';

export class UpdateEmpleadoDto extends PickType(CreateEmpleadoDto, ['email', 'rolId', 'fechaContratacion'] as const) { }
