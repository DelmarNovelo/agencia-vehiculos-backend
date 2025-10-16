import { Transform, Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { CreateUnidadVehicularDto } from "src/unidades-vehiculares/dto/create-unidad-vehicular.dto";

export class CreateVehiculoDto {
  @IsNumber()
  @IsNotEmpty()
  marcaId: number;

  @IsNumber()
  @IsNotEmpty()
  lineaId: number;

  @IsNumber()
  @IsNotEmpty()
  modeloId: number;

  @IsNumber()
  @IsNotEmpty()
  colorId: number;

  @IsNumber()
  @IsNotEmpty()
  combustibleId: number;

  @IsNumber()
  @IsNotEmpty()
  transmisionId: number;

  @IsNumber()
  @IsNotEmpty()
  tipoVehiculoId: number;

  @IsNumber()
  @IsNotEmpty()
  precioVenta: number;

  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => {
    const trimedValue = value?.trim();
    return trimedValue ? trimedValue : null;
  })
  descripcion: string | null;

  @IsArray()
  @IsOptional()
  @Type(() => CreateUnidadVehicularDto)
  @ValidateNested({ each: true })
  unidades: CreateUnidadVehicularDto[];

}
