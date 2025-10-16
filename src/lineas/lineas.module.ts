import { forwardRef, Module } from '@nestjs/common';
import { LineasService } from './lineas.service';
import { LineasController } from './lineas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Linea } from './entities/linea.entity';
import { MarcasModule } from 'src/marcas/marcas.module';

@Module({
  controllers: [LineasController],
  providers: [LineasService],
  imports: [
    TypeOrmModule.forFeature([
      Linea,
    ]),
    forwardRef(() => MarcasModule),
  ],
  exports: [
    TypeOrmModule,
    LineasService,
  ]
})
export class LineasModule {}
