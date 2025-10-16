import { Module } from '@nestjs/common';
import { InformesService } from './informes.service';
import { InformesController } from './informes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from 'src/ventas/entities/venta.entity';
import { Compra } from 'src/compras/entities/compra.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';

@Module({
  controllers: [InformesController],
  providers: [InformesService],
  imports: [
    TypeOrmModule.forFeature([
      Venta,
      Compra,
      Cliente,
    ])
  ]
})
export class InformesModule {}
