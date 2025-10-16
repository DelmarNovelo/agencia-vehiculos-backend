import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUnidadVehicularDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  vin: string;
}
