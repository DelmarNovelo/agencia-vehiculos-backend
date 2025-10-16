import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateDireccionDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  calle: string;

  @IsNumber()
  departamentoId: number;
  
  @IsNumber()
  municipioId: number;
}
