import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePersonaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  apellido: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  })
  dpi: string | null;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  })
  nit: string | null;

  @IsNumber()
  @IsOptional()
  sucursalId: number;
}
