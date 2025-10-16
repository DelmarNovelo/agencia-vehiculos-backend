import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsEnum } from "class-validator";
import { TiposDocumento } from "src/common/enums/tipos-documento.enum";

export class CreateCompraDocDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  numDocumento: string;

  @IsEnum(TiposDocumento)
  @IsNotEmpty()
  tipoDocumento: TiposDocumento;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  fechaEmision: string;
}
