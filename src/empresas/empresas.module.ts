import { Module } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { EmpresasController } from './empresas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from './entities/empresa.entity';

@Module({
  controllers: [EmpresasController],
  providers: [EmpresasService],
  imports: [
    TypeOrmModule.forFeature([
      Empresa,
    ])
  ]
})
export class EmpresasModule {}
