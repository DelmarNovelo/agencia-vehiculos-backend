import { Module } from '@nestjs/common';
import { VehiculosService } from './vehiculos.service';
import { VehiculosController } from './vehiculos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehiculo } from './entities/vehiculo.entity';

@Module({
  controllers: [VehiculosController],
  providers: [VehiculosService],
  imports: [
    TypeOrmModule.forFeature([
      Vehiculo
    ])
  ]
})
export class VehiculosModule {}
