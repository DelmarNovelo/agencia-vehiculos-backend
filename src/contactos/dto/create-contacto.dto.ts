import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateContactoDto {
  @IsNumber()
  @IsNotEmpty()
  tipoContactoId: number;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  valorContacto: string;

  @IsNumber()
  @IsOptional()
  ownerId?: number;

  @IsString()
  @IsOptional()
  ownerType?: 'persona' | 'empresa';

}
