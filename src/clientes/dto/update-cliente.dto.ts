import { PartialType } from '@nestjs/mapped-types';
import { CreateClienteDto } from './create-cliente.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateClienteDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  apellido: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  dpi: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  nit: string;
}
