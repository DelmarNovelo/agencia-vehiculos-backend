import { Module } from '@nestjs/common';
import { ModelosService } from './modelos.service';
import { ModelosController } from './modelos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Modelo } from './entities/modelo.entity';

@Module({
  controllers: [ModelosController],
  providers: [ModelosService],
  imports: [
    TypeOrmModule.forFeature([
      Modelo
    ])
  ],
})
export class ModelosModule {}
