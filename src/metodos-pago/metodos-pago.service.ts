import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMetodoPagoDto } from './dto/create-metodo-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto';
import { MetodoPago } from './entities/metodo-pago.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MetodosPagoService {
  constructor(
    @InjectRepository(MetodoPago)
    private readonly tipoPagoRepository: Repository<MetodoPago>,
  ) {}

  async create(createMetodoPagoDto: CreateMetodoPagoDto) {
    const { nombre } = createMetodoPagoDto;

    // Validar que no exista otro con mismo nombre que no esté soft deleted
    const existing = await this.tipoPagoRepository.findOne({
      where: { nombre },
      withDeleted: true,
    });
    if (existing && !existing.deletedAt) {
      throw new ConflictException('Ya existe un tipo de pago con ese nombre');
    }

    const tipoPago = this.tipoPagoRepository.create(createMetodoPagoDto);
    const tipoPagoCreado = await this.tipoPagoRepository.save(tipoPago);
    return { id: tipoPagoCreado.id, nombre: tipoPagoCreado.nombre };
  }

  async findAll(searchTerm: string) {
    return this.tipoPagoRepository.createQueryBuilder('tipoPago')
      .where('tipoPago.deletedAt IS NULL')
      .andWhere(searchTerm ? 'UPPER(tipoPago.nombre) LIKE UPPER(:search)' : '1=1', { search: `%${searchTerm}%` })  // Aplicar búsqueda si existe
      .select(['tipoPago.id', 'tipoPago.nombre'])
      .orderBy('tipoPago.nombre', 'ASC')
      .getMany();
  }

  async findAllForSelect() {
    return this.tipoPagoRepository.find({
      withDeleted: false,
      select: ['id', 'nombre'],
    });
  }

  async findOne(id: number): Promise<MetodoPago> {
    const tipoPago = await this.tipoPagoRepository.findOne({
      where: { id },
      select: ['id', 'nombre'],
    });
    if (!tipoPago) {
      throw new NotFoundException(`Tipo de pago con id ${id} no encontrado`);
    }
    return tipoPago;
  }

  async update(id: number, updateMetodoPagoDto: UpdateMetodoPagoDto) {
    const tipoPago = await this.findOne(id);
    const { nombre } = updateMetodoPagoDto;

    // Validar que no exista otro con mismo nombre que no esté soft deleted, excluyendo el actual
    if (nombre) {
      const existing = await this.tipoPagoRepository.findOne({
        where: { nombre },
        withDeleted: true,
      });
      if (existing && existing.id !== id && !existing.deletedAt) {
        throw new ConflictException('Ya existe un tipo de pago con ese nombre');
      }
    }

    Object.assign(tipoPago, updateMetodoPagoDto);
    await this.tipoPagoRepository.save(tipoPago);
    return { message: 'Tipo de pago actualizado' };
  }

  async remove(id: number): Promise<void> {
    const tipoPago = await this.findOne(id);
    await this.tipoPagoRepository.softDelete(id);
  }
}
