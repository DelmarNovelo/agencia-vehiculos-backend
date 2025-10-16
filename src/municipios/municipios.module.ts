import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MunicipiosService } from './municipios.service';
import { MunicipiosController } from './municipios.controller';
import { Municipio } from './entities/municipio.entity';
import { DepartamentosModule } from 'src/departamentos/departamentos.module';

@Module({
  controllers: [MunicipiosController],
  providers: [MunicipiosService],
  imports: [
    TypeOrmModule.forFeature([
      Municipio,
    ]),
    forwardRef(() => DepartamentosModule),
  ],
  exports: [
    TypeOrmModule,
    MunicipiosService,
  ]
})
export class MunicipiosModule { }
