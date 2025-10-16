import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCombustibleDto } from './dto/create-combustible.dto';
import { UpdateCombustibleDto } from './dto/update-combustible.dto';
import { Combustible } from './entities/combustible.entity';

@Injectable()
export class CombustiblesService {
  constructor(
    @InjectRepository(Combustible)
    private readonly combustibleRepository: Repository<Combustible>,
  ) { }

  async create(createCombustibleDto: CreateCombustibleDto) {
    const { nombre } = createCombustibleDto;

    // Validar que no exista otro con mismo nombre que no esté soft deleted
    const existing = await this.combustibleRepository.findOne({
      where: { nombre },
      withDeleted: true,
    });
    if (existing && !existing.deletedAt) {
      throw new ConflictException('Ya existe un combustible con ese nombre');
    }

    const combustible = this.combustibleRepository.create(createCombustibleDto);
    const combustibleCreado = await this.combustibleRepository.save(combustible);
    return { id: combustibleCreado.id, nombre: combustibleCreado.nombre };
  }

  async findAll(searchTerm: string) {
    return this.combustibleRepository.createQueryBuilder('combustible')
      .where('UPPER(combustible.nombre) LIKE UPPER(:search)', { search: `%${searchTerm}%` })
      .select(['combustible.id', 'combustible.nombre'])
      .orderBy('combustible.nombre', 'ASC')
      .getMany();
  }

  async findAllForSelect() {
    return this.combustibleRepository.find({
      select: ['id', 'nombre'],
    });
  }

  async findOne(id: number): Promise<Combustible> {
    const combustible = await this.combustibleRepository.findOne({
      where: { id },
      select: ['id', 'nombre'],
    });
    if (!combustible) {
      throw new NotFoundException(`Combustible con id ${id} no encontrado`);
    }
    return combustible;
  }

  async update(id: number, updateCombustibleDto: UpdateCombustibleDto) {
    const combustible = await this.findOne(id);
    const { nombre } = updateCombustibleDto;

    // Validar que no exista otro con mismo nombre que no esté soft deleted, excluyendo el actual
    if (nombre) {
      const existing = await this.combustibleRepository.findOne({
        where: { nombre },
        withDeleted: true,
      });
      if (existing && existing.id !== id && !existing.deletedAt) {
        throw new ConflictException('Ya existe un combustible con ese nombre');
      }
    }

    Object.assign(combustible, updateCombustibleDto);
    await this.combustibleRepository.save(combustible);
    return { message: 'Combustible actualizado' }
  }

  async remove(id: number): Promise<void> {
    const combustible = await this.findOne(id);
    await this.combustibleRepository.softDelete(id);
  }
}
