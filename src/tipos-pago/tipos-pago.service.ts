import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTiposPagoDto } from './dto/create-tipos-pago.dto';
import { UpdateTiposPagoDto } from './dto/update-tipos-pago.dto';
import { TipoPago } from './entities/tipo-pago.entity';

@Injectable()
export class TiposPagoService {
  constructor(
    @InjectRepository(TipoPago)
    private readonly tipoPagoRepository: Repository<TipoPago>,
  ) {}

  async create(createTiposPagoDto: CreateTiposPagoDto) {
    const { nombre } = createTiposPagoDto;

    // Validar que no exista otro con mismo nombre que no esté soft deleted
    const existing = await this.tipoPagoRepository.findOne({
      where: { nombre },
      withDeleted: true,
    });
    if (existing && !existing.deletedAt) {
      throw new ConflictException('Ya existe un tipo de pago con ese nombre');
    }

    const tipoPago = this.tipoPagoRepository.create(createTiposPagoDto);
    const tipoPagoCreado = await this.tipoPagoRepository.save(tipoPago);
    return { id: tipoPagoCreado.id, nombre: tipoPagoCreado.nombre };
  }

  async findAll(searchTerm: string) {
    return this.tipoPagoRepository.createQueryBuilder('tipoPago')
      .where('tipoPago.deletedAt IS NULL')  // Filtrar soft deletes
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

  async findOne(id: number): Promise<TipoPago> {
    const tipoPago = await this.tipoPagoRepository.findOne({
      where: { id },
      select: ['id', 'nombre'],
    });
    if (!tipoPago) {
      throw new NotFoundException(`Tipo de pago con id ${id} no encontrado`);
    }
    return tipoPago;
  }

  async update(id: number, updateTiposPagoDto: UpdateTiposPagoDto) {
    const tipoPago = await this.findOne(id);
    const { nombre } = updateTiposPagoDto;

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

    Object.assign(tipoPago, updateTiposPagoDto);
    await this.tipoPagoRepository.save(tipoPago);
    return { message: 'Tipo de pago actualizado' };
  }

  async remove(id: number): Promise<void> {
    const tipoPago = await this.findOne(id);
    await this.tipoPagoRepository.softDelete(id);
  }
}
