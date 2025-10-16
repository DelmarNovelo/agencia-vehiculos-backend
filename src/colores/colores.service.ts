import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { Color } from './entities/color.entity';

@Injectable()
export class ColoresService {
  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
  ) { }

  async create(CreateColorDto: CreateColorDto) {
    const { nombre } = CreateColorDto;

    // Validar que no exista otro con mismo nombre que no esté soft deleted
    const existing = await this.colorRepository.findOne({
      where: { nombre },
      withDeleted: true,
    });
    if (existing && !existing.deletedAt) {
      throw new ConflictException('Ya existe un color con ese nombre');
    }

    const color = this.colorRepository.create(CreateColorDto);
    const colorCreado = await this.colorRepository.save(color);
    return { id: colorCreado.id, nombre: colorCreado.nombre };
  }

  async findAll(searchTerm: string) {
    return this.colorRepository.createQueryBuilder('color')
      .where('UPPER(color.nombre) LIKE UPPER(:search)', { search: `%${searchTerm}%` })
      .select(['color.id', 'color.nombre'])
      .orderBy('color.nombre', 'ASC')
      .getMany();
  }

  async findAllForSelect() {
    return this.colorRepository.find({
      select: ['id', 'nombre'],
    });
  }

  async findOne(id: number): Promise<Color> {
    const color = await this.colorRepository.findOne({
      where: { id },
      select: ['id', 'nombre'],
    });
    if (!color) {
      throw new NotFoundException(`Color con id ${id} no encontrado`);
    }
    return color;
  }

  async update(id: number, UpdateColorDto: UpdateColorDto) {
    const color = await this.findOne(id);
    const { nombre } = UpdateColorDto;

    // Validar que no exista otro con mismo nombre que no esté soft deleted, excluyendo el actual
    if (nombre) {
      const existing = await this.colorRepository.findOne({
        where: { nombre },
        withDeleted: true,
      });
      if (existing && existing.id !== id && !existing.deletedAt) {
        throw new ConflictException('Ya existe un color con ese nombre');
      }
    }

    Object.assign(color, UpdateColorDto);
    await this.colorRepository.save(color);
    return { message: 'Color actualizado' }
  }

  async remove(id: number): Promise<void> {
    const color = await this.findOne(id);
    await this.colorRepository.softDelete(id);
  }
}
