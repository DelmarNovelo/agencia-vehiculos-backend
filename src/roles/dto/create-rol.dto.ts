import { Transform, Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateRolDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  nombre: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  })
  descripcion: string;

  @IsArray()
  @IsNotEmpty()
  @Type(() => Number)
  permisos: number[];
}
