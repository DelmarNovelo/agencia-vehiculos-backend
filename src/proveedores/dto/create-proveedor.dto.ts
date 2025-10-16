import { PickType } from "@nestjs/mapped-types";
import { Transform, Type } from "class-transformer";
import { ValidateNested, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateContactoProveedorDto } from "src/contactos-proveedor/dto/create-contacto-proveedor.dto";
import { CreateDireccionDto } from "src/direcciones/dto/create-direccion.dto";

export class CreateLegalDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  razonSocial: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  })
  nit: string | null;
}

export class CreateProveedorDto extends PickType(CreateContactoProveedorDto, ['persona', 'contactos'] as const) {
  @ValidateNested()
  @Type(() => CreateLegalDto)
  legal: CreateLegalDto;

  @ValidateNested()
  @Type(() => CreateDireccionDto)
  direccion?: CreateDireccionDto;
}
