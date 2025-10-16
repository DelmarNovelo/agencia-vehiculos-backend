import { Module } from '@nestjs/common';
import { DireccionesService } from './direcciones.service';
import { DireccionesController } from './direcciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Direccion } from './entities/direccion.entity';
import { MunicipiosModule } from 'src/municipios/municipios.module';

@Module({
  controllers: [DireccionesController],
  providers: [DireccionesService],
  imports: [
    TypeOrmModule.forFeature([
      Direccion
    ]),
    MunicipiosModule,
  ],
  exports: [
    TypeOrmModule,
    DireccionesService
  ]
})
export class DireccionesModule {}
