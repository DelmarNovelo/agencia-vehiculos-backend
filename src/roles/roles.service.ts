import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { Rol } from './entities/rol.entity';
import { DataSource, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Permiso } from 'src/permisos/entities/permiso.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class RolesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    @InjectRepository(Permiso)
    private readonly permisoRepository: Repository<Permiso>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) { }

  async create(createRolDto: CreateRolDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { nombre, descripcion, permisos } = createRolDto;

      const existing = await queryRunner.manager.findOne(Rol, {
        where: { nombre },
      });

      if (existing) {
        throw new ConflictException('Ya existe un rol con ese nombre');
      }

      const permisosEntidades = await queryRunner.manager.find(Permiso, {
        where: { id: In(permisos) },
      });

      if (!permisosEntidades.length) {
        throw new BadRequestException('No se encontraron permisos válidos');
      }

      const rol = queryRunner.manager.create(Rol, {
        nombre,
        descripcion,
        permisos: permisosEntidades,
      });

      const rolCreado = await queryRunner.manager.save(rol);

      await queryRunner.commitTransaction();

      return { id: rolCreado.id, nombre: rolCreado.nombre, descripcion: rolCreado.descripcion };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(searchTerm?: string) {
    const queryBuilder = this.rolRepository
      .createQueryBuilder('rol')
      .where('UPPER(rol.nombre) LIKE UPPER(:search)', { search: `%${searchTerm}%` })
      .select(['rol.id', 'rol.nombre', 'rol.descripcion', 'rol.canBeDeleted'])
      .orderBy('rol.nombre', 'ASC');

    return queryBuilder.getMany();
  }

  async findAllForSelect() {
    return this.rolRepository.find({
      select: ['id', 'nombre', 'descripcion'],
    });
  }

  async findOne(id: number) {
    const rol = await this.rolRepository.findOne({
      where: { id },
      relations: ['permisos'],
      select: ['id', 'nombre', 'descripcion', 'canBeDeleted'],
    });
    if (!rol) {
      throw new NotFoundException(`Rol con id ${id} no encontrado`);
    }

    const { id: rolId, nombre, descripcion, canBeDeleted } = rol;
    const permisos = rol.permisos.map(p => p.id);

    return {
      id: rolId,
      nombre,
      descripcion,
      canBeDeleted,
      permisos
    };
  }

  async update(id: number, updateRolDto: UpdateRolDto) {
    const rol = await this.rolRepository.findOne({
      where: { id },
    });

    if (!rol) {
      throw new NotFoundException(`Rol con id ${id} no encontrado`);
    }

    const { nombre, descripcion, permisos } = updateRolDto;

    // Validar que no exista otro con mismo nombre, excluyendo el actual
    if (nombre) {
      const existing = await this.rolRepository.findOne({
        where: { nombre },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Ya existe un rol con ese nombre');
      }
    }

    const permisosEntidades = await this.permisoRepository.find({
      where: { id: In(permisos) },
    });

    if (!permisosEntidades.length) {
      throw new BadRequestException('No se encontraron permisos válidos');
    }

    rol.nombre = nombre;
    rol.descripcion = descripcion;
    rol.permisos = permisosEntidades;

    await this.rolRepository.save(rol);

    return { message: 'Rol actualizado' };
  }

  async remove(id: number): Promise<void> {
    const rol = await this.rolRepository.findOne({
      where: { id },
    });

    if (!rol) {
      throw new NotFoundException(`Rol con id ${id} no encontrado`);
    }

    if (!rol.canBeDeleted) {
      throw new ConflictException('Este rol no puede ser editado porque es un rol predeterminado del sistema');
    }

    // Verificar que no esté asignado a usuarios no soft deleted
    const usuariosAsignados = await this.rolRepository
      .createQueryBuilder('rol')
      .leftJoin('rol.usuarios', 'usuario')
      .where('rol.id = :id', { id })
      .andWhere('usuario.deletedAt IS NULL')
      .select('COUNT(usuario.id)', 'count')
      .getRawOne();

    if (usuariosAsignados.count > 0) {
      throw new ConflictException('No se puede eliminar el rol porque está asignado a usuarios activos');
    }

    await this.rolRepository.remove(rol);
  }
}
