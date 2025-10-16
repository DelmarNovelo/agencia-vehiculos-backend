import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateEmpresaDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  razonSocial: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  nit: string;
}
