import { Transform, Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { TiposVenta } from "src/common/enums/tipos-venta.enum";

export class CreateItemVentaDto {
  @IsNumber()
  @IsNotEmpty()
  vehiculoId: number;

  @IsNumber()
  @IsNotEmpty()
  unidadId: number;

  @IsString()
  @IsNotEmpty()
  vin: string;

  @IsNumber()
  @IsNotEmpty()
  descuento: number;
}

export class CreateVentaDto {
  @IsNumber()
  @IsNotEmpty()
  clienteId: number;

  @IsNumber()
  @IsNotEmpty()
  metodoPagoId: number;

  @IsEnum(TiposVenta)
  @IsNotEmpty()
  tipoVenta: TiposVenta; 

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  notas?: string;

  @IsArray()
  @Type(() => CreateItemVentaDto)
  @ValidateNested({ each: true })
  items: CreateItemVentaDto[];
}
