import { Module } from '@nestjs/common';
import { PreciosVentaService } from './precios-venta.service';
import { PreciosVentaController } from './precios-venta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrecioVenta } from './entities/precio-venta.entity';

@Module({
  controllers: [PreciosVentaController],
  providers: [PreciosVentaService],
  imports: [
    TypeOrmModule.forFeature([
      PrecioVenta
    ])
  ],
})
export class PreciosVentaModule {}
