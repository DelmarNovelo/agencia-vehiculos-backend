import { Module } from '@nestjs/common';
import { PermisosService } from './permisos.service';
import { PermisosController } from './permisos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permiso } from './entities/permiso.entity';

@Module({
  controllers: [PermisosController],
  providers: [PermisosService],
  imports: [
    TypeOrmModule.forFeature([
      Permiso
    ])
  ]
})
export class PermisosModule {}
