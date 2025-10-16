import { IsBoolean, IsNotEmpty } from 'class-validator';
import { CreateUnidadVehicularDto } from './create-unidad-vehicular.dto';

export class UpdateUnidadVehicularDto extends CreateUnidadVehicularDto {
  @IsNotEmpty()
  @IsBoolean()
  disponible: boolean;
}
