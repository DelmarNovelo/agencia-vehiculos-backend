import { Module } from '@nestjs/common';
import { UnidadesVehicularesService } from './unidades-vehiculares.service';
import { UnidadesVehicularesController } from './unidades-vehiculares.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnidadVehicular } from './entities/unidad-vehicular.entity';

@Module({
  controllers: [UnidadesVehicularesController],
  providers: [UnidadesVehicularesService],
  imports: [
    TypeOrmModule.forFeature([
      UnidadVehicular
    ])
  ]
})
export class UnidadesVehicularesModule {}
