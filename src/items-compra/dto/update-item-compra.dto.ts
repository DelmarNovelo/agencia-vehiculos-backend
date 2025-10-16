import { PartialType } from '@nestjs/mapped-types';
import { CreateItemCompraDto } from './create-item-compra.dto';

export class UpdateItemCompraDto extends PartialType(CreateItemCompraDto) {}
