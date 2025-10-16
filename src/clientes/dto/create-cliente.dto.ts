import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateContactoDto } from 'src/contactos/dto/create-contacto.dto';
import { CreateDireccionDto } from 'src/direcciones/dto/create-direccion.dto';
import { CreatePersonaDto } from 'src/personas/dto/create-persona.dto';

export class CreateClienteDto {
  @ValidateNested()
  @Type(() => CreatePersonaDto)
  persona: CreatePersonaDto;

  @ValidateNested()
  @Type(() => CreateDireccionDto)
  direccion?: CreateDireccionDto;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateContactoDto)
  contactos: CreateContactoDto[];
}
