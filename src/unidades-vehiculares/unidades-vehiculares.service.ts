import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUnidadVehicularDto } from './dto/create-unidad-vehicular.dto';
import { UpdateUnidadVehicularDto } from './dto/update-unidad-vehicular.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnidadVehicular } from './entities/unidad-vehicular.entity';
import { Vehiculo } from 'src/vehiculos/entities/vehiculo.entity';

@Injectable()
export class UnidadesVehicularesService {
  constructor(
    @InjectRepository(UnidadVehicular)
    private readonly unidadVehicularRepository: Repository<UnidadVehicular>,
  ) { }

  async create(createUnidadVehicularDto: CreateUnidadVehicularDto, vehiculoId: number) {
    const { vin } = createUnidadVehicularDto;

    // Validar que no exista otro con mismo VIN que no esté soft deleted
    const existing = await this.unidadVehicularRepository.findOne({
      where: { vin },
      withDeleted: true,
    });
    if (existing && !existing.deletedAt) {
      throw new ConflictException('Ya existe una unidad vehicular con ese VIN');
    }

    // Validar que el vehículo existe
    const vehiculo = await this.unidadVehicularRepository.manager.findOneBy(Vehiculo, { id: vehiculoId });
    if (!vehiculo) {
      throw new NotFoundException('El vehículo especificado no fue encontrado');
    }

    const unidadVehicular = this.unidadVehicularRepository.create({
      vin,
      vehiculo,
    });

    const unidadVehicularCreada = await this.unidadVehicularRepository.save(unidadVehicular);
    return { id: unidadVehicularCreada.id, vin: unidadVehicularCreada.vin };
  }

  findAllByVehicle(vehiculoId: number) {
    return this.unidadVehicularRepository.createQueryBuilder('unidad')
      .where('unidad.VEHICULO_ID = :vehiculoId', { vehiculoId })
      .select([
        'unidad.id',
        'unidad.vin',
        'unidad.disponible',
      ])
      .getMany();
  }

  async findAllByVehicleForSale(vehiculoId: number) {
    return this.unidadVehicularRepository.createQueryBuilder('unidad')
      .where('unidad.VEHICULO_ID = :vehiculoId', { vehiculoId })
      .andWhere('unidad.disponible = :disponible', { disponible: true })
      .select([
        'unidad.id',
        'unidad.vin',
        'unidad.disponible',
      ])
      .getMany();
  }

  async findOne(id: number): Promise<UnidadVehicular> {
    const unidadVehicular = await this.unidadVehicularRepository.findOne({
      where: { id },
      select: ['id', 'vin', 'disponible'],
    });
    if (!unidadVehicular) {
      throw new NotFoundException(`Unidad vehicular con id ${id} no encontrada`);
    }
    return unidadVehicular;
  }

  async update(id: number, updateUnidadVehicularDto: UpdateUnidadVehicularDto) {
    const unidadVehicular = await this.findOne(id);
    const { vin } = updateUnidadVehicularDto;

    // Validar que no exista otro con mismo VIN que no esté soft deleted, excluyendo el actual
    if (vin) {
      const existing = await this.unidadVehicularRepository.findOne({
        where: { vin },
        withDeleted: true,
      });
      if (existing && existing.id !== id && !existing.deletedAt) {
        throw new ConflictException('Ya existe una unidad vehicular con ese VIN');
      }
    }

    Object.assign(unidadVehicular, updateUnidadVehicularDto);
    await this.unidadVehicularRepository.save(unidadVehicular);
    return { message: 'Unidad vehicular actualizada' };
  }

  async remove(id: number): Promise<void> {
    const unidadVehicular = await this.findOne(id);
    await this.unidadVehicularRepository.softDelete(id);
  }

  async findAll(searchTerm: string) {
    return this.unidadVehicularRepository.createQueryBuilder('unidadVehicular')
      .where('unidadVehicular.deletedAt IS NULL')  // Filtrar soft deletes
      .andWhere(searchTerm ? 'UPPER(unidadVehicular.vin) LIKE UPPER(:search)' : '1=1', { search: `%${searchTerm}%` })  // Aplicar búsqueda si existe
      .select(['unidadVehicular.id', 'unidadVehicular.vin', 'unidadVehicular.disponible'])
      .orderBy('unidadVehicular.vin', 'ASC')
      .getMany();
  }

  async findAllForSelect() {
    return this.unidadVehicularRepository.find({
      withDeleted: false,
      select: ['id', 'vin'],
    });
  }
}
