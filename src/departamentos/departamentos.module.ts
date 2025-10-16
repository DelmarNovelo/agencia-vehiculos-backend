import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartamentosService } from './departamentos.service';
import { DepartamentosController } from './departamentos.controller';
import { Departamento } from './entities/departamento.entity';
import { MunicipiosModule } from 'src/municipios/municipios.module';

@Module({
  controllers: [DepartamentosController],
  providers: [DepartamentosService],
  imports: [
    TypeOrmModule.forFeature([
      Departamento,
    ]),
    forwardRef(() => MunicipiosModule),
  ],
  exports: [
    TypeOrmModule,
    DepartamentosService,
  ]
})
export class DepartamentosModule {}
