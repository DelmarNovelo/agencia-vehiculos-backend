import { ContactoProveedorPersonaDto, CreateContactoProveedorDto } from './create-contacto-proveedor.dto';

export class UpdateContactoProveedorDto extends ContactoProveedorPersonaDto { }

/* 
export class UpdateContactoProveedorDto {
  @ValidateNested()
  @Type(() => CreateContactoProveedorDto)
  persona: CreateContactoProveedorDto;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateContactoDto)
  contactos: CreateContactoDto[];
}
*/