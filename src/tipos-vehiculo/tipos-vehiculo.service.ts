import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTipoVehiculoDto } from './dto/create-tipo-vehiculo.dto';
import { UpdateTipoVehiculoDto } from './dto/update-tipo-vehiculo.dto';
import { TipoVehiculo } from './entities/tipo-vehiculo.entity';

@Injectable()
export class TiposVehiculoService {
  constructor(
    @InjectRepository(TipoVehiculo)
    private readonly tipoVehiculoRepository: Repository<TipoVehiculo>,
  ) { }

  async create(createTipoVehiculoDto: CreateTipoVehiculoDto) {
    const { nombre } = createTipoVehiculoDto;

    // Validar que no exista otro con mismo nombre que no esté soft deleted
    const existing = await this.tipoVehiculoRepository.findOne({
      where: { nombre },
      withDeleted: true,
    });
    if (existing && !existing.deletedAt) {
      throw new ConflictException('Ya existe un tipo de vehículo con ese nombre');
    }

    const tipoVehiculo = this.tipoVehiculoRepository.create(createTipoVehiculoDto);
    const tipoVehiculoCreado = await this.tipoVehiculoRepository.save(tipoVehiculo);
    return { id: tipoVehiculoCreado.id, nombre: tipoVehiculoCreado.nombre };
  }

  async findAll(searchTerm: string) {
    return this.tipoVehiculoRepository.createQueryBuilder('tipoVehiculo')
      .where('UPPER(tipoVehiculo.nombre) LIKE UPPER(:search)', { search: `%${searchTerm}%` })
      .select(['tipoVehiculo.id', 'tipoVehiculo.nombre'])
      .orderBy('tipoVehiculo.nombre', 'ASC')
      .getMany();
  }

  async findAllForSelect() {
    return this.tipoVehiculoRepository.find({
      select: ['id', 'nombre'],
    });
  }

  async findOne(id: number): Promise<TipoVehiculo> {
    const tipoVehiculo = await this.tipoVehiculoRepository.findOne({
      where: { id },
      select: ['id', 'nombre'],
    });
    if (!tipoVehiculo) {
      throw new NotFoundException(`Tipo de vehículo con id ${id} no encontrado`);
    }
    return tipoVehiculo;
  }

  async update(id: number, updateTipoVehiculoDto: UpdateTipoVehiculoDto) {
    const tipoVehiculo = await this.findOne(id);
    const { nombre } = updateTipoVehiculoDto;

    // Validar que no exista otro con mismo nombre que no esté soft deleted, excluyendo el actual
    if (nombre) {
      const existing = await this.tipoVehiculoRepository.findOne({
        where: { nombre },
        withDeleted: true,
      });
      if (existing && existing.id !== id && !existing.deletedAt) {
        throw new ConflictException('Ya existe un tipo de vehículo con ese nombre');
      }
    }

    Object.assign(tipoVehiculo, updateTipoVehiculoDto);
    await this.tipoVehiculoRepository.save(tipoVehiculo);
    return { message: 'Tipo de vehículo actualizado' }
  }

  async remove(id: number): Promise<void> {
    const tipoVehiculo = await this.findOne(id);
    await this.tipoVehiculoRepository.softDelete(id);
  }
}
