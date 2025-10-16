import { Module } from '@nestjs/common';
import { TiposContactoService } from './tipos-contacto.service';
import { TiposContactoController } from './tipos-contacto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoContacto } from './entities/tipos-contacto.entity';

@Module({
  controllers: [TiposContactoController],
  providers: [TiposContactoService],
  imports: [
    TypeOrmModule.forFeature([
      TipoContacto
    ])
  ],
  exports: [
    TypeOrmModule,
    TiposContactoService,
  ]
})
export class TiposContactoModule {}
