import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateMetodoPagoDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  nombre: string;
}
