import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateTipoContactoDto } from './dto/create-tipo-contacto.dto';
import { UpdateTipoContactoDto } from './dto/update-tipo-contacto.dto';
import { TipoContacto } from './entities/tipos-contacto.entity';

@Injectable()
export class TiposContactoService {
  constructor(
    @InjectRepository(TipoContacto)
    private readonly tipoContactoRepository: Repository<TipoContacto>,
  ) {}

  async create(createTipoContactoDto: CreateTipoContactoDto) {
    const { nombre } = createTipoContactoDto;

    // Validar que no exista otro con mismo nombre que no esté soft deleted
    const existing = await this.tipoContactoRepository.findOne({
      where: { nombre },
      withDeleted: true,
    });
    if (existing && !existing.deletedAt) {
      throw new ConflictException('Ya existe un tipo de contacto con ese nombre');
    }

    const tipoContacto = this.tipoContactoRepository.create(createTipoContactoDto);
    const tipoContactoCreado = await this.tipoContactoRepository.save(tipoContacto);
    return { id: tipoContactoCreado.id, nombre: tipoContactoCreado.nombre };
  }

  async findAll(searchTerm: string = '') {
    return this.tipoContactoRepository.createQueryBuilder('tipoContacto')
      .where('UPPER(tipoContacto.nombre) LIKE UPPER(:search)', { search: `%${searchTerm}%` })
      .select(['tipoContacto.id', 'tipoContacto.nombre'])
      .orderBy('tipoContacto.nombre', 'ASC')
      .getMany();
  }

  async findAllForSelect() {
    return this.tipoContactoRepository.find({
      withDeleted: false,
      select: ['id', 'nombre'],
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<TipoContacto> {
    const tipoContacto = await this.tipoContactoRepository.findOne({
      where: { id },
      select: ['id', 'nombre'],
    });
    if (!tipoContacto) {
      throw new NotFoundException(`Tipo de contacto con id ${id} no encontrado`);
    }
    return tipoContacto;
  }

  async update(id: number, updateTipoContactoDto: UpdateTipoContactoDto) {
    const tipoContacto = await this.findOne(id);
    const { nombre } = updateTipoContactoDto;

    // Validar que no exista otro con mismo nombre que no esté soft deleted, excluyendo el actual
    if (nombre) {
      const existing = await this.tipoContactoRepository.findOne({
        where: { nombre },
        withDeleted: true,
      });
      if (existing && existing.id !== id && !existing.deletedAt) {
        throw new ConflictException('Ya existe un tipo de contacto con ese nombre');
      }
    }

    Object.assign(tipoContacto, updateTipoContactoDto);
    await this.tipoContactoRepository.save(tipoContacto);
    return { message: 'Tipo de contacto actualizado' };
  }

  async remove(id: number): Promise<void> {
    const tipoContacto = await this.tipoContactoRepository.findOne({
      where: { id },
      relations: ['contactos'],
    });

    if (!tipoContacto) {
      throw new NotFoundException(`Tipo de contacto con id ${id} no encontrado`);
    }

    // Verificar que no esté asignado a ningún contacto
    if (tipoContacto.contactos && tipoContacto.contactos.length > 0) {
      throw new ConflictException('No se puede eliminar el tipo de contacto porque está asignado a uno o más contactos');
    }

    await this.tipoContactoRepository.softDelete(id);
  }
}
