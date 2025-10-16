import { OmitType } from '@nestjs/mapped-types';
import { CreateVehiculoDto } from './create-vehiculo.dto';

export class UpdateVehiculoDto extends OmitType(CreateVehiculoDto, ['precioVenta', 'unidades'] as const) { }
