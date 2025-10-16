import { Injectable } from '@nestjs/common';
import { CreateModuloPermisoDto } from './dto/create-modulo-permiso.dto';
import { UpdateModuloPermisoDto } from './dto/update-modulo-permiso.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuloPermiso } from './entities/modulo-permiso.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ModuloPermisosService {
  constructor(
    @InjectRepository(ModuloPermiso)
    private readonly moduloPermisoRepository: Repository<ModuloPermiso>,
  ) { }
  
  create(createModuloPermisoDto: CreateModuloPermisoDto) {
    return 'This action adds a new moduloPermiso';
  }

  findAll() {
    return this.moduloPermisoRepository.createQueryBuilder('modulo')
      .leftJoinAndSelect('modulo.permisos', 'permiso')
      .orderBy('modulo.nombre', 'ASC')
      .addOrderBy('permiso.id', 'ASC')
      .getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} moduloPermiso`;
  }

  update(id: number, updateModuloPermisoDto: UpdateModuloPermisoDto) {
    return `This action updates a #${id} moduloPermiso`;
  }

  remove(id: number) {
    return `This action removes a #${id} moduloPermiso`;
  }
}
