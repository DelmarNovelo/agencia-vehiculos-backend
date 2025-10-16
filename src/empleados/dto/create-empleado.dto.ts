import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateEmpleadoDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  email: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  password: string;

  @IsNumber()
  @IsNotEmpty()
  rolId: number;
  
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  fechaContratacion: string;
}
