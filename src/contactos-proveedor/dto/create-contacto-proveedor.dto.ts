import { PickType } from "@nestjs/mapped-types";
import { Transform, Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { CreateContactoDto } from "src/contactos/dto/create-contacto.dto";
import { CreatePersonaDto } from "src/personas/dto/create-persona.dto";

export class ContactoProveedorPersonaDto extends PickType(CreatePersonaDto, ['nombre', 'apellido'] as const) {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  cargo: string;
}

export class CreateContactoProveedorDto {
  @ValidateNested()
  @Type(() => ContactoProveedorPersonaDto)
  persona: ContactoProveedorPersonaDto;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateContactoDto)
  contactos: CreateContactoDto[];
}
