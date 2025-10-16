import { Module } from '@nestjs/common';
import { ModuloPermisosService } from './modulo-permisos.service';
import { ModuloPermisosController } from './modulo-permisos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuloPermiso } from './entities/modulo-permiso.entity';

@Module({
  controllers: [ModuloPermisosController],
  providers: [ModuloPermisosService],
  imports: [
    TypeOrmModule.forFeature([
      ModuloPermiso
    ])
  ]
})
export class ModuloPermisosModule {}
