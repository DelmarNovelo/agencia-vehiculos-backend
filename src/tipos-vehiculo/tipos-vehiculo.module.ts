import { Module } from '@nestjs/common';
import { TiposVehiculoService } from './tipos-vehiculo.service';
import { TiposVehiculoController } from './tipos-vehiculo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoVehiculo } from './entities/tipo-vehiculo.entity';

@Module({
  controllers: [TiposVehiculoController],
  providers: [TiposVehiculoService],
  imports: [
    TypeOrmModule.forFeature([
      TipoVehiculo
    ])
  ],
})
export class TiposVehiculoModule {}
