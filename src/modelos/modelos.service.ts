import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateModeloDto } from './dto/create-modelo.dto';
import { UpdateModeloDto } from './dto/update-modelo.dto';
import { Modelo } from './entities/modelo.entity';

@Injectable()
export class ModelosService {
  constructor(
    @InjectRepository(Modelo)
    private readonly modeloRepository: Repository<Modelo>,
  ) { }

  async create(createModeloDto: CreateModeloDto) {
    const { nombre } = createModeloDto;

    // Validar que no exista otro con mismo nombre que no esté soft deleted
    const existing = await this.modeloRepository.findOne({
      where: { nombre },
      withDeleted: true,
    });
    if (existing && !existing.deletedAt) {
      throw new ConflictException('Ya existe un modelo con ese nombre');
    }

    const modelo = this.modeloRepository.create(createModeloDto);
    const modeloCreado = await this.modeloRepository.save(modelo);
    return { id: modeloCreado.id, nombre: modeloCreado.nombre };
  }

  async findAll(searchTerm: string) {
    return this.modeloRepository.createQueryBuilder('modelo')
      .where('UPPER(modelo.nombre) LIKE UPPER(:search)', { search: `%${searchTerm}%` })
      .select(['modelo.id', 'modelo.nombre'])
      .orderBy('modelo.nombre', 'ASC')
      .getMany();
  }

  async findAllForSelect() {
    return this.modeloRepository.find({
      select: ['id', 'nombre'],
    });
  }

  async findOne(id: number): Promise<Modelo> {
    const modelo = await this.modeloRepository.findOne({
      where: { id },
      select: ['id', 'nombre'],
    });
    if (!modelo) {
      throw new NotFoundException(`Modelo con id ${id} no encontrado`);
    }
    return modelo;
  }

  async update(id: number, updateModeloDto: UpdateModeloDto) {
    const modelo = await this.findOne(id);
    const { nombre } = updateModeloDto;

    // Validar que no exista otro con mismo nombre que no esté soft deleted, excluyendo el actual
    if (nombre) {
      const existing = await this.modeloRepository.findOne({
        where: { nombre },
        withDeleted: true,
      });
      if (existing && existing.id !== id && !existing.deletedAt) {
        throw new ConflictException('Ya existe un modelo con ese nombre');
      }
    }

    Object.assign(modelo, updateModeloDto);
    await this.modeloRepository.save(modelo);
    return { message: 'Modelo actualizado' }
  }

  async remove(id: number): Promise<void> {
    const modelo = await this.findOne(id);
    await this.modeloRepository.softDelete(id);
  }
}
