import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateDepartamentoDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  nombre: string;

  @IsArray()
  municipios: string[];
}
