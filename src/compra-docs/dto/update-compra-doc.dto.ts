import { PartialType } from '@nestjs/mapped-types';
import { CreateCompraDocDto } from './create-compra-doc.dto';

export class UpdateCompraDocDto extends PartialType(CreateCompraDocDto) {}
