import { forwardRef, Module } from '@nestjs/common';
import { MarcasService } from './marcas.service';
import { MarcasController } from './marcas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Marca } from './entities/marca.entity';
import { LineasModule } from 'src/lineas/lineas.module';

@Module({
  controllers: [MarcasController],
  providers: [MarcasService],
  imports: [
    TypeOrmModule.forFeature([
      Marca
    ]),
    forwardRef(() => LineasModule),
  ],
  exports: [
    TypeOrmModule,
    MarcasService,
  ]
})
export class MarcasModule { }
