import { PartialType } from '@nestjs/mapped-types';
import { CreateTiposPagoDto } from './create-tipos-pago.dto';

export class UpdateTiposPagoDto extends PartialType(CreateTiposPagoDto) {}
