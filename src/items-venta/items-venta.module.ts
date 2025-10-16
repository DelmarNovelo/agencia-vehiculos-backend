import { Module } from '@nestjs/common';
import { ItemsVentaService } from './items-venta.service';
import { ItemsVentaController } from './items-venta.controller';

@Module({
  controllers: [ItemsVentaController],
  providers: [ItemsVentaService],
})
export class ItemsVentaModule {}
