import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateItemCompraDto {
  @IsNumber()
  @IsNotEmpty()
  precioCompra: number;

  @IsNumber()
  @IsNotEmpty()
  descuento: number;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  vin: string

  @IsNumber()
  @IsNotEmpty()
  vehiculoId: number;
}
