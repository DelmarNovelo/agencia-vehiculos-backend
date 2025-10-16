import { Type } from "class-transformer";
import { ValidateNested, IsArray, IsNotEmpty } from "class-validator";
import { CreateContactoDto } from "src/contactos/dto/create-contacto.dto";
import { CreateDireccionDto } from "src/direcciones/dto/create-direccion.dto";
import { CreateEmpleadoDto } from "src/empleados/dto/create-empleado.dto";
import { CreatePersonaDto } from "src/personas/dto/create-persona.dto";

export class CreateUsuarioDto {
  @ValidateNested()
  @Type(() => CreatePersonaDto)
  persona: CreatePersonaDto;

  @ValidateNested()
  @Type(() => CreateEmpleadoDto)
  empleado: CreateEmpleadoDto;

  @ValidateNested()
  @Type(() => CreateDireccionDto)
  direccion?: CreateDireccionDto;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateContactoDto)
  contactos: CreateContactoDto[];
}

