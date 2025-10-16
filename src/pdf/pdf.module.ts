import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from 'src/ventas/entities/venta.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { ItemVenta } from 'src/items-venta/entities/item-venta.entity';
import { Vehiculo } from 'src/vehiculos/entities/vehiculo.entity';
import { UnidadVehicular } from 'src/unidades-vehiculares/entities/unidad-vehicular.entity';
import { Modelo } from 'src/modelos/entities/modelo.entity';
import { Marca } from 'src/marcas/entities/marca.entity';

@Module({
  controllers: [PdfController],
  providers: [PdfService],
  imports: [
    TypeOrmModule.forFeature([
      Venta,
    ])
  ]
})
export class PdfModule {}
