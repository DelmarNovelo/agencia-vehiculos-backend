import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePrecioVentaDto {
  @IsNumber()
  @IsNotEmpty()
  precioBase: number;

  @IsNotEmpty()
  @IsString()
  vigenteDesde: string;
}
