import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransmisionDto } from './dto/create-transmision.dto';
import { UpdateTransmisionDto } from './dto/update-transmision.dto';
import { Transmision } from './entities/transmision.entity';

@Injectable()
export class TransmisionesService {
  constructor(
    @InjectRepository(Transmision)
    private readonly transmisionRepository: Repository<Transmision>,
  ) {}

  async create(CreateTransmisionDto: CreateTransmisionDto) {
    const { nombre } = CreateTransmisionDto;

    // Validar que no exista otro con mismo nombre que no esté soft deleted
    const existing = await this.transmisionRepository.findOne({
      where: { nombre },
      withDeleted: true,
    });
    if (existing && !existing.deletedAt) {
      throw new ConflictException('Ya existe una transmisión con ese nombre');
    }

    const transmision = this.transmisionRepository.create(CreateTransmisionDto);
    const transmisionCreada = await this.transmisionRepository.save(transmision);
    return { id: transmisionCreada.id, nombre: transmisionCreada.nombre };
  }

  async findAll(searchTerm: string) {
    return this.transmisionRepository.createQueryBuilder('transmision')
      .where('UPPER(transmision.nombre) LIKE UPPER(:search)', { search: `%${searchTerm}%` })
      .select(['transmision.id', 'transmision.nombre'])
      .orderBy('transmision.nombre', 'ASC')
      .getMany();
  }

  async findAllForSelect() {
    return this.transmisionRepository.find({
      select: ['id', 'nombre'],
    });
  }

  async findOne(id: number): Promise<Transmision> {
    const transmision = await this.transmisionRepository.findOne({
      where: { id },
      select: ['id', 'nombre'],
    });
    if (!transmision) {
      throw new NotFoundException(`Transmisión con id ${id} no encontrada`);
    }
    return transmision;
  }

  async update(id: number, UpdateTransmisionDto: UpdateTransmisionDto) {
    const transmision = await this.findOne(id);
    const { nombre } = UpdateTransmisionDto;

    // Validar que no exista otro con mismo nombre que no esté soft deleted, excluyendo el actual
    if (nombre) {
      const existing = await this.transmisionRepository.findOne({
        where: { nombre },
        withDeleted: true,
      });
      if (existing && existing.id !== id && !existing.deletedAt) {
        throw new ConflictException('Ya existe una transmisión con ese nombre');
      }
    }

    Object.assign(transmision, UpdateTransmisionDto);
    await this.transmisionRepository.save(transmision);
    return { message: 'Transmisión actualizada' }
  }

  async remove(id: number): Promise<void> {
    const transmision = await this.findOne(id);
    await this.transmisionRepository.softDelete(id);
  }
}
