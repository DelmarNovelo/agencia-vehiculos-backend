import { Module } from '@nestjs/common';
import { TransmisionesService } from './transmisiones.service';
import { TransmisionesController } from './transmisiones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transmision } from './entities/transmision.entity';

@Module({
  controllers: [TransmisionesController],
  providers: [TransmisionesService],
  imports: [
    TypeOrmModule.forFeature([
      Transmision,
    ]),
  ]
})
export class TransmisionesModule { }
