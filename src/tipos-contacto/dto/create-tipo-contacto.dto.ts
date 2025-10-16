import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
50908597
export class CreateTipoContactoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Transform(({ value }) => {
    const trimmed = value?.trim();
    return trimmed?.length > 0 ? trimmed : undefined;
  })
  nombre: string;
}
