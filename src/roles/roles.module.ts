import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity';
import { Permiso } from 'src/permisos/entities/permiso.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [
    TypeOrmModule.forFeature([
      Rol,
      Permiso,
      Usuario,
    ])
  ]
})
export class RolesModule {}
