import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateModeloDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre: string;
}
