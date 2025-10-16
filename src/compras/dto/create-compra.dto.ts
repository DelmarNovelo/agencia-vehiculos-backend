import { Transform, Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { TiposVenta } from "src/common/enums/tipos-venta.enum";
import { CreateCompraDocDto } from "src/compra-docs/dto/create-compra-doc.dto";
import { CreateItemCompraDto } from "src/items-compra/dto/create-item-compra.dto";

export class Compra {
  @IsEnum(TiposVenta)
  @IsNotEmpty()
  tipoCompra: TiposVenta;

  @IsNumber()
  @IsNotEmpty()
  metodoPagoId: number;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  })
  notas: string | null;
}

export class CreateCompraDto {
  @IsNumber()
  @IsNotEmpty()
  proveedorId: number;

  @ValidateNested()
  @Type(() => Compra)
  compra: Compra;

  @ValidateNested()
  @Type(() => CreateCompraDocDto)
  documento: CreateCompraDocDto;
  
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateItemCompraDto)
  items: CreateItemCompraDto[];
}
